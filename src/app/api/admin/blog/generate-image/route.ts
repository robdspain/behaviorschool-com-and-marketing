
import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import jwt from 'jsonwebtoken';
import FormData from 'form-data';
import fetch from 'node-fetch';

const GHOST_URL = process.env.GHOST_ADMIN_URL || process.env.GHOST_CONTENT_URL?.replace('/ghost/api/content', '') || 'https://ghost.behaviorschool.com';
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY;
const GCP_PROJECT = process.env.GCP_PROJECT;
const GCP_LOCATION = process.env.GCP_LOCATION;

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

    if (!GCP_PROJECT || !GCP_LOCATION) {
      return NextResponse.json({ success: false, error: 'GCP project or location not configured' }, { status: 500 });
    }

    const vertexAI = new VertexAI({ project: GCP_PROJECT, location: GCP_LOCATION });

    const generativeModel = vertexAI.getGenerativeModel({
        model: 'imagegeneration@0.0.1',
    });

    const resp = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    if (!resp.response.candidates || !resp.response.candidates.length) {
        return NextResponse.json({ success: false, error: 'No image generated' }, { status: 500 });
    }

    const firstCandidate = resp.response.candidates[0];
    const firstPart: any = firstCandidate?.content?.parts?.[0];
    // Vertex may return inlineData.data (base64) or fileData.fileUri (http/gs/data URI)
    let imageBuffer: Buffer | null = null;
    const inlineDataB64: string | undefined = firstPart?.inlineData?.data;
    const fileData = firstPart && 'fileData' in firstPart ? (firstPart.fileData as any) : null;
    const fileUri: string | undefined = fileData?.fileUri;

    if (inlineDataB64) {
      imageBuffer = Buffer.from(inlineDataB64, 'base64');
    } else if (fileUri) {
      if (fileUri.startsWith('data:image/')) {
        const base64 = fileUri.split(',')[1];
        imageBuffer = base64 ? Buffer.from(base64, 'base64') : null;
      } else if (fileUri.startsWith('http')) {
        const res = await fetch(fileUri);
        if (!res.ok) {
          return NextResponse.json({ success: false, error: `Failed to fetch generated image (${res.status})` }, { status: 502 });
        }
        const arr = await res.arrayBuffer();
        imageBuffer = Buffer.from(arr);
      } else {
        return NextResponse.json({ success: false, error: 'Unsupported fileUri scheme from Vertex' }, { status: 502 });
      }
    }

    if (!imageBuffer) {
      return NextResponse.json({ success: false, error: 'No valid image data in response' }, { status: 500 });
    }

    const formData = new FormData();
    formData.append('file', imageBuffer, {
      contentType: 'image/png',
      filename: 'generated-image.png'
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
