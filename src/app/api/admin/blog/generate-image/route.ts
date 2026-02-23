
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import FormData from 'form-data';
import fetch from 'node-fetch';
import sharp from 'sharp';

const GHOST_URL = process.env.GHOST_ADMIN_URL || process.env.GHOST_CONTENT_URL?.replace('/ghost/api/content', '') || 'https://ghost.behaviorschool.com';
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY;
const COMFYUI_URL = process.env.COMFYUI_URL || 'http://127.0.0.1:8188';

function getGhostToken() {
  if (!GHOST_ADMIN_KEY) {
    throw new Error('Ghost Admin API key not configured');
  }

  const [id, secret] = GHOST_ADMIN_KEY.split(':');

  const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: '/admin/'
  });

  return token;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    // ---- ComfyUI workflow (based on user_workflows/rs-test-workflow.json) ----
    const workflow = {
      "4": { "class_type": "CheckpointLoaderSimple", "inputs": { "ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors" } },
      "5": { "class_type": "EmptyLatentImage", "inputs": { "width": 512, "height": 512, "batch_size": 1 } },
      "6": { "class_type": "CLIPTextEncode", "inputs": { "text": prompt, "clip": ["4", 1] } },
      "7": { "class_type": "CLIPTextEncode", "inputs": { "text": "text, watermark", "clip": ["4", 1] } },
      "3": { "class_type": "KSampler", "inputs": { "seed": Math.floor(Math.random() * 1e9), "steps": 20, "cfg": 8, "sampler_name": "euler", "scheduler": "normal", "denoise": 1, "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0], "latent_image": ["5", 0] } },
      "8": { "class_type": "VAEDecode", "inputs": { "samples": ["3", 0], "vae": ["4", 2] } },
      "9": { "class_type": "SaveImage", "inputs": { "filename_prefix": "behaviorschool-blog", "images": ["8", 0] } }
    } as Record<string, any>;

    const promptResp = await fetch(`${COMFYUI_URL}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow })
    });

    if (!promptResp.ok) {
      const err = await promptResp.text();
      return NextResponse.json({ success: false, error: `ComfyUI prompt failed (${promptResp.status}): ${err}` }, { status: 502 });
    }

    const promptJson: any = await promptResp.json();
    const promptId = promptJson?.prompt_id;
    if (!promptId) {
      return NextResponse.json({ success: false, error: 'ComfyUI did not return a prompt_id' }, { status: 502 });
    }

    // Poll history for the result
    let imageFilename: string | null = null;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const historyResp = await fetch(`${COMFYUI_URL}/history/${promptId}`);
      if (!historyResp.ok) continue;
      const historyJson: any = await historyResp.json();
      const entry = historyJson?.[promptId];
      const outputs = entry?.outputs?.["9"]?.images;
      if (outputs && outputs.length) {
        imageFilename = outputs[0].filename;
        break;
      }
    }

    if (!imageFilename) {
      return NextResponse.json({ success: false, error: 'ComfyUI did not return an image in time' }, { status: 504 });
    }

    const viewResp = await fetch(`${COMFYUI_URL}/view?filename=${encodeURIComponent(imageFilename)}`);
    if (!viewResp.ok) {
      return NextResponse.json({ success: false, error: `Failed to fetch ComfyUI image (${viewResp.status})` }, { status: 502 });
    }
    const arr = await viewResp.arrayBuffer();
    const imageBuffer = Buffer.from(arr);

    const webpBuffer = await sharp(imageBuffer).webp({ quality: 88 }).toBuffer();
    const webpFilename = imageFilename.replace(/\.[^.]+$/, '') + '.webp';

    const formData = new FormData();
    formData.append('file', webpBuffer, {
      contentType: 'image/webp',
      filename: webpFilename
    });

    const ghostToken = getGhostToken();

    const ghostResponse = await fetch(`${GHOST_URL}/ghost/api/admin/images/upload/`, {
      method: 'POST',
      headers: {
        Authorization: `Ghost ${ghostToken}`,
        ...formData.getHeaders()
      },
      body: formData,
    });

    if (!ghostResponse.ok) {
      const error = await ghostResponse.text();
      console.error('Ghost API error:', error);
      return NextResponse.json({
        success: false,
        error: `Failed to upload image to Ghost: ${ghostResponse.status}`
      }, { status: ghostResponse.status });
    }

    const data = await ghostResponse.json();

    return NextResponse.json({
      success: true,
      imageUrl: data.images[0].url
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
