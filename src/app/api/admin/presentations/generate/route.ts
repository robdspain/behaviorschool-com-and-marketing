import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PptxGenJS from 'pptxgenjs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { createSupabaseAdminClient, withSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, slideCount = 10, template = 'modern', tone = 'professional', language = 'English', model = 'gemini-1.5-pro', provider = 'google', apiKey, exportAs = 'pptx', ollamaEndpoint, slides, templateFonts } = body;

    console.log('Generate request:', { topic, slideCount, template, tone, language, model, provider, hasApiKey: !!apiKey });

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!slides && !apiKey) {
      return NextResponse.json(
        { error: 'API key is required. Please configure your AI provider key in the Settings tab.' },
        { status: 400 }
      );
    }

    // Generate presentation content using AI
    let slideContent: Array<{ title: string; content: string[] }>;

    if (Array.isArray(slides) && slides.length) {
      slideContent = slides;
    } else if (provider === 'google') {
      slideContent = await generateWithGemini(apiKey, topic, slideCount, tone, language, model);
    } else if (provider === 'openai') {
      slideContent = await generateWithOpenAI(apiKey, topic, slideCount, tone, language, model);
    } else if (provider === 'anthropic') {
      slideContent = await generateWithAnthropic(apiKey, topic, slideCount, tone, language, model);
    } else if (provider === 'ollama') {
      slideContent = await generateWithOllama(ollamaEndpoint, topic, slideCount, tone, language, model);
    } else {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      );
    }

    if (exportAs === 'pdf') {
      // Build a simple PDF (title page + slides)
      const pdf = await buildPdfFromSlides(topic, slideContent, template);
      await persistPresentation({
        buffer: pdf,
        topic,
        slideCount,
        template,
        tone,
        language,
        provider,
        model,
        exportAs,
      });
      return new NextResponse(Buffer.from(pdf), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${sanitizeFilename(topic)}.pdf"`,
        },
      });
    } else if (exportAs === 'pdf_hifi') {
      try {
        const html = await buildHtmlFromSlides(topic, slideContent as any, template, templateFonts);
        const pdf = await buildHiFiPdf(html);
        await persistPresentation({
          buffer: pdf,
          topic,
          slideCount,
          template,
          tone,
          language,
          provider,
          model,
          exportAs: 'pdf',
        });
        return new NextResponse(Buffer.from(pdf), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${sanitizeFilename(topic)}.pdf"`,
          },
        });
      } catch (e) {
        console.warn('HiFi PDF failed, falling back to basic PDF:', (e as Error)?.message);
        const pdf = await buildPdfFromSlides(topic, slideContent, template);
        return new NextResponse(Buffer.from(pdf), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${sanitizeFilename(topic)}.pdf"`,
          },
        });
      }
    }

    // Default: Create PowerPoint using pptxgenjs
    const pptBuffer = await buildPptxFromSlides(topic, slideContent, template, templateFonts);
    await persistPresentation({
      buffer: pptBuffer,
      topic,
      slideCount,
      template,
      tone,
      language,
      provider,
      model,
      exportAs,
    });
    return new NextResponse(pptBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${sanitizeFilename(topic)}.pptx"`,
      },
    });
  } catch (error) {
    console.error('Presentation generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate presentation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function generateWithGemini(
  apiKey: string,
  topic: string,
  slideCount: number,
  tone: string,
  language: string,
  modelName: string
): Promise<Array<{ title: string; content: string[] }>> {
  try {
    console.log('Initializing Gemini with model:', modelName);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Create a ${slideCount}-slide presentation about "${topic}" in ${language}.
The tone should be ${tone}.

For each slide (excluding the title slide), provide:
1. A clear, concise title
2. 3-5 bullet points with key information

Format your response as a JSON array of objects with this structure:
[
  {
    "title": "Slide Title",
    "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
  }
]

Generate ${slideCount - 1} content slides (the title slide will be added automatically).`;

    console.log('Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('Gemini response received, length:', text.length);

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Failed to parse JSON from response:', text.substring(0, 500));
      throw new Error('Failed to parse AI response. Response format was invalid.');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    console.log(`Successfully parsed ${parsed.length} slides`);
    return parsed;
  } catch (error) {
    console.error('Gemini generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw error;
  }
}

async function generateWithOpenAI(
  apiKey: string,
  topic: string,
  slideCount: number,
  tone: string,
  language: string,
  modelName: string
): Promise<Array<{ title: string; content: string[] }>> {
  try {
    const prompt = `Create a ${slideCount}-slide presentation about "${topic}" in ${language}.
The tone should be ${tone}.

For each slide (excluding the title slide), provide:
1. A clear, concise title
2. 3-5 bullet points with key information

Format your response as a JSON array of objects with this structure:
[
  { "title": "Slide Title", "content": ["Bullet 1", "Bullet 2", "Bullet 3"] }
]

Generate ${slideCount - 1} content slides (the title slide will be added automatically).`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName || 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that outputs only valid JSON unless explicitly asked otherwise.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`OpenAI HTTP ${resp.status}: ${errText}`);
    }
    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Failed to parse OpenAI JSON response');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('OpenAI generation error:', error);
    if (error instanceof Error) throw new Error(`OpenAI API error: ${error.message}`);
    throw error;
  }
}

async function generateWithAnthropic(
  apiKey: string,
  topic: string,
  slideCount: number,
  tone: string,
  language: string,
  modelName: string
): Promise<Array<{ title: string; content: string[] }>> {
  try {
    const prompt = `Create a ${slideCount}-slide presentation about "${topic}" in ${language}.
The tone should be ${tone}.

For each slide (excluding the title slide), provide:
1. A clear, concise title
2. 3-5 bullet points with key information

Output only a JSON array of objects with this structure:
[
  { "title": "Slide Title", "content": ["Bullet 1", "Bullet 2", "Bullet 3"] }
]

Generate ${slideCount - 1} content slides (the title slide will be added automatically).`;

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName || 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: prompt }
        ]
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Anthropic HTTP ${resp.status}: ${errText}`);
    }
    const data = await resp.json();
    const content = data.content?.[0]?.text || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Failed to parse Anthropic JSON response');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Anthropic generation error:', error);
    if (error instanceof Error) throw new Error(`Anthropic API error: ${error.message}`);
    throw error;
  }
}

type ChartData = {
  type: 'bar'|'line'|'pie'|'doughnut',
  categories: string[],
  series: Array<{ name: string; values: number[] }>,
  stacked?: boolean,
  showLegend?: boolean,
  xLabel?: string,
  yLabel?: string,
  seriesColors?: string[],
  legendPosition?: 'top-right'|'bottom'|'right'|'left',
  yFormat?: 'auto'|'number'|'currency'|'percent',
  labelStyle?: 'auto'|'inside'|'above',
  showStackPercent?: boolean,
}
type SlideInput = { title: string; content: string[]; imageUrl?: string; icons?: string[]; chart?: ChartData; layout?: 'auto'|'text'|'image-right'|'image-left'|'two-column'|'quote'|'title-only'|'image-full'|'metrics-3'|'chart-right'|'chart-left' };

async function buildPptxFromSlides(
  topic: string,
  slideContent: SlideInput[],
  template: string,
  templateFonts?: { titleFontUrl?: string; bodyFontUrl?: string; titleFontName?: string; bodyFontName?: string }
) {
  const pptx = new PptxGenJS();
  const templateConfig = getTemplateConfig(template);
  const titleFontFace = templateFonts?.titleFontName || 'Arial';
  const bodyFontFace = templateFonts?.bodyFontName || 'Arial';

  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: templateConfig.primaryColor };
  titleSlide.addText(topic, {
    x: 0.5, y: 2.0, w: '90%', h: 1.5,
    fontSize: 44, bold: true, color: templateConfig.titleColor, align: 'center', fontFace: titleFontFace,
  });
  titleSlide.addText('Generated by Behavior School AI', {
    x: 0.5, y: 5.0, w: '90%', h: 0.5,
    fontSize: 16, color: templateConfig.subtitleColor, align: 'center', fontFace: bodyFontFace,
  });

  for (const slide of slideContent) {
    const contentSlide = pptx.addSlide();
    contentSlide.background = { color: templateConfig.backgroundColor };
    const layout = slide.layout || 'auto';
    const resolveLayout: SlideInput['layout'] = layout === 'auto'
      ? (slide.imageUrl ? 'image-right' : 'text')
      : layout;

    // Title
    contentSlide.addText(slide.title, { x: 0.5, y: 0.5, w: '90%', h: 0.75, fontSize: 32, bold: true, color: templateConfig.titleColor, fontFace: titleFontFace });

    const bullets = slide.content.map((point) => ({ text: point, options: { bullet: true } }));

    if (resolveLayout === 'text') {
      contentSlide.addText(bullets, { x: 0.5, y: 1.5, w: '90%', h: 4.0, fontSize: 18, color: templateConfig.textColor, bullet: { type: 'bullet' }, valign: 'top', fontFace: bodyFontFace });
    } else if (resolveLayout === 'image-right') {
      if (slide.imageUrl) {
        try { const { dataUrl } = await fetchImageAsDataUrl(slide.imageUrl); contentSlide.addImage({ data: dataUrl, x: 6.0, y: 1.5, w: 4.5, h: 3.0 }); } catch (_) {}
      }
      contentSlide.addText(bullets, { x: 0.5, y: 1.5, w: 5.0, h: 4.0, fontSize: 18, color: templateConfig.textColor, bullet: { type: 'bullet' }, valign: 'top', fontFace: bodyFontFace });
    } else if (resolveLayout === 'image-left') {
      if (slide.imageUrl) {
        try { const { dataUrl } = await fetchImageAsDataUrl(slide.imageUrl); contentSlide.addImage({ data: dataUrl, x: 0.5, y: 1.5, w: 4.5, h: 3.0 }); } catch (_) {}
      }
      contentSlide.addText(bullets, { x: 5.3, y: 1.5, w: 4.5, h: 4.0, fontSize: 18, color: templateConfig.textColor, bullet: { type: 'bullet' }, valign: 'top', fontFace: bodyFontFace });
    } else if (resolveLayout === 'two-column') {
      const mid = Math.ceil(bullets.length / 2);
      const left = bullets.slice(0, mid);
      const right = bullets.slice(mid);
      contentSlide.addText(left, { x: 0.5, y: 1.5, w: 4.5, h: 4.0, fontSize: 18, color: templateConfig.textColor, bullet: { type: 'bullet' }, valign: 'top', fontFace: bodyFontFace });
      contentSlide.addText(right, { x: 5.3, y: 1.5, w: 4.5, h: 4.0, fontSize: 18, color: templateConfig.textColor, bullet: { type: 'bullet' }, valign: 'top', fontFace: bodyFontFace });
    } else if (resolveLayout === 'quote') {
      const quote = slide.content[0] || '';
      contentSlide.addText(`“${quote}”`, { x: 0.7, y: 1.8, w: 8.6, h: 3.0, fontSize: 28, italic: true, color: templateConfig.textColor, align: 'center', fontFace: bodyFontFace });
    } else if (resolveLayout === 'title-only') {
      // nothing else to render
    } else if (resolveLayout === 'image-full') {
      if (slide.imageUrl) { try { const { dataUrl } = await fetchImageAsDataUrl(slide.imageUrl); contentSlide.addImage({ data: dataUrl, x: 0, y: 0, w: 10, h: 5.6 }); } catch (_) {} }
    }
    else if (resolveLayout === 'metrics-3') {
      const metrics = parseMetrics(slide.content).slice(0,3);
      const boxW = 3.0; const boxH = 2.0; const top = 2.0; const gaps = [0.7, 4.0, 7.3];
      for (let i = 0; i < 3; i++) {
        const m = metrics[i] || { label: `Metric ${i+1}`, value: null, display: null } as any;
        contentSlide.addShape(pptx.ShapeType.rect, { x: gaps[i], y: top, w: boxW, h: boxH, fill: { color: 'FFFFFF' }, line: { color: templateConfig.textColor } });
        if (m.value !== null) {
          contentSlide.addText(m.display ?? String(m.value), { x: gaps[i] + 0.2, y: top + 0.2, w: boxW - 0.4, h: 0.9, fontSize: 30, bold: true, color: templateConfig.titleColor, valign: 'top' });
          contentSlide.addText(m.label, { x: gaps[i] + 0.2, y: top + 1.2, w: boxW - 0.4, h: 0.6, fontSize: 14, color: templateConfig.textColor, valign: 'top' });
        } else {
          contentSlide.addText(m.label, { x: gaps[i] + 0.2, y: top + 0.2, w: boxW - 0.4, h: 0.6, fontSize: 18, bold: true, color: templateConfig.titleColor, valign: 'top' });
        }
      }
    }
    else if (resolveLayout === 'chart-right' || resolveLayout === 'chart-left') {
      const chartX = resolveLayout === 'chart-right' ? 6.0 : 0.5;
      const textX = resolveLayout === 'chart-right' ? 0.5 : 6.0;
      const chartY = 1.5; const chartW = 4.5; const chartH = 3.0;
      if (slide.chart && slide.chart.categories?.length && slide.chart.series?.length) {
        try {
          const pptxData = slide.chart.series.map(s => ({ name: s.name, labels: slide.chart!.categories, values: s.values }));
          const chartType = slide.chart.type === 'line' ? pptx.ChartType.line : slide.chart.type === 'pie' ? pptx.ChartType.pie : slide.chart.type === 'doughnut' ? pptx.ChartType.doughnut : pptx.ChartType.bar;
          // Heuristics for dense charts -> use inside labels to reduce collisions
          const dense = (slide.chart.categories.length * slide.chart.series.length) > 16 || slide.chart.series.length >= 4;
          const labelStyle = slide.chart.labelStyle || 'auto';
          const useInside = labelStyle === 'inside' || (labelStyle !== 'above' && dense);
          contentSlide.addChart(chartType, pptxData as any, {
            x: chartX, y: chartY, w: chartW, h: chartH,
            showLegend: slide.chart.showLegend ?? (slide.chart.series.length > 1),
            catAxisLabelColor: templateConfig.textColor,
            valAxisLabelColor: templateConfig.textColor,
            catAxisLabelFontFace: bodyFontFace,
            valAxisLabelFontFace: bodyFontFace,
            catAxisTitle: slide.chart.xLabel,
            valAxisTitle: slide.chart.yLabel,
            barGrouping: slide.chart.stacked ? 'stacked' : 'clustered',
            chartColors: slide.chart.seriesColors && slide.chart.seriesColors.length ? slide.chart.seriesColors : chartColorsForTemplate(template, slide.chart.series.length),
            legendPos: ((): any => {
              switch (slide.chart?.legendPosition) {
                case 'left': return 'l';
                case 'bottom': return 'b';
                case 'right': return 'r';
                default: return 't';
              }
            })(),
            // Data label tuning: prefer inside for dense layouts
            dataLabelPosition: useInside ? 'inEnd' : 'outEnd',
            dataLabelFontSize: 8,
            dataLabelColor: templateConfig.textColor,
            dataLabelFontFace: bodyFontFace,
          } as any);
        } catch {
          contentSlide.addShape(pptx.ShapeType.rect, { x: chartX, y: chartY, w: chartW, h: chartH, fill: { color: 'FFFFFF' }, line: { color: templateConfig.textColor } });
        }
      } else {
        contentSlide.addShape(pptx.ShapeType.rect, { x: chartX, y: chartY, w: chartW, h: chartH, fill: { color: 'FFFFFF' }, line: { color: templateConfig.textColor } });
        const data = parseChart(slide.content);
        if (data.length) {
          const max = Math.max(...data.map(d => d.value));
          const barGap = 0.3; const barW = (chartW - barGap * (data.length + 1)) / data.length;
          data.forEach((d, i) => {
            const h = max > 0 ? (d.value / max) * (chartH - 0.5) : 0;
            const x = chartX + barGap + i * (barW + barGap);
            const y = chartY + 0.1 + (chartH - 0.1 - h);
            contentSlide.addShape(pptx.ShapeType.rect, { x, y, w: barW, h, fill: { color: templateConfig.primaryColor }, line: { color: templateConfig.titleColor } });
          });
        }
      }
      contentSlide.addText(bullets, { x: textX, y: 1.5, w: 4.8, h: 4.0, fontSize: 18, color: templateConfig.textColor, bullet: { type: 'bullet' }, valign: 'top', fontFace: bodyFontFace });
    }

    // Render icons row at bottom if provided
    if (slide.icons && slide.icons.length > 0) {
      let x = 0.8; const y = 5.8; const size = 0.6; const gap = 0.4;
      for (const iconUrl of slide.icons.slice(0, 6)) {
        try {
          const { dataUrl } = await fetchImageAsDataUrl(iconUrl);
          contentSlide.addImage({ data: dataUrl, x, y, w: size, h: size });
          x += size + gap;
        } catch (_) { /* ignore */ }
      }
    }
  }

  const pptxBuffer = await pptx.write({ outputType: 'arraybuffer' }) as ArrayBuffer;
  return new Uint8Array(pptxBuffer);
}

async function buildPdfFromSlides(
  topic: string,
  slideContent: SlideInput[],
  template: string
) {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const templateConfig = getTemplateConfig(template);

  // Title page
  let page = pdfDoc.addPage([612, 792]); // Letter size
  page.drawRectangle({ x: 0, y: 0, width: 612, height: 150, color: hexToRgb(templateConfig.primaryColor) });
  page.drawText(topic, { x: 50, y: 540, size: 28, font: helveticaBold, color: hexToRgb(templateConfig.titleColor) });
  page.drawText('Generated by Behavior School AI', { x: 50, y: 510, size: 12, font: helvetica, color: hexToRgb(templateConfig.subtitleColor) });

  // Content pages
  for (const slide of slideContent) {
    page = pdfDoc.addPage([612, 792]);
    page.drawText(slide.title, { x: 50, y: 720, size: 20, font: helveticaBold, color: hexToRgb(templateConfig.titleColor) });
    const layout = slide.layout || 'auto';
    const resolveLayout: SlideInput['layout'] = layout === 'auto' ? (slide.imageUrl ? 'image-right' : 'text') : layout;

    let y = 690;
    let textX = 50; let textW = 480;
    if (resolveLayout === 'text') {
      // nothing special
    } else if (resolveLayout === 'image-right') {
      if (slide.imageUrl) { try { const img = await fetchImageForPdf(slide.imageUrl, pdfDoc); if (img) { page.drawImage(img, { x: 340, y: 510, width: 250, height: 170 }); textW = 260; } } catch (_) {} }
    } else if (resolveLayout === 'image-left') {
      if (slide.imageUrl) { try { const img = await fetchImageForPdf(slide.imageUrl, pdfDoc); if (img) { page.drawImage(img, { x: 50, y: 510, width: 250, height: 170 }); textX = 340; textW = 220; } } catch (_) {} }
    } else if (resolveLayout === 'two-column') {
      // handle below in drawing
    } else if (resolveLayout === 'quote') {
      const quote = slide.content[0] || '';
      page.drawText(`“${quote}”`, { x: 60, y: 620, size: 20, font: helveticaBold, color: hexToRgb(templateConfig.textColor), maxWidth: 500 });
      y = 580;
    } else if (resolveLayout === 'title-only') {
      // nothing
      y = 0;
    } else if (resolveLayout === 'image-full') {
      if (slide.imageUrl) { try { const img = await fetchImageForPdf(slide.imageUrl, pdfDoc); if (img) { page.drawImage(img, { x: 0, y: 0, width: 612, height: 792 }); } } catch (_) {} }
      y = 0;
    }

    if (resolveLayout === 'two-column') {
      const mid = Math.ceil(slide.content.length / 2);
      const left = slide.content.slice(0, mid);
      const right = slide.content.slice(mid);
      let yL = 690; let yR = 690;
      for (const line of left) { page.drawText(`• ${line}`, { x: 60, y: yL, size: 12, font: helvetica, color: hexToRgb(templateConfig.textColor), maxWidth: 240 }); yL -= 20; }
      for (const line of right) { page.drawText(`• ${line}`, { x: 340, y: yR, size: 12, font: helvetica, color: hexToRgb(templateConfig.textColor), maxWidth: 240 }); yR -= 20; }
    } else if (resolveLayout === 'metrics-3') {
      const top = 510; const w = 170; const h = 130;
      const metrics = parseMetrics(slide.content).slice(0,3);
      for (let i = 0; i < 3; i++) {
        const m = metrics[i] || { label: `Metric ${i+1}`, value: null, display: null } as any;
        const x = 60 + i * 190;
        page.drawRectangle({ x, y: top, width: w, height: h, color: hexToRgb(templateConfig.backgroundColor), borderColor: hexToRgb(templateConfig.textColor) });
        if (m.value !== null) {
          page.drawText(m.display ?? String(m.value), { x: x + 10, y: top + h - 36, size: 18, font: helveticaBold, color: hexToRgb(templateConfig.titleColor) });
          page.drawText(m.label, { x: x + 10, y: top + 20, size: 12, font: helvetica, color: hexToRgb(templateConfig.textColor) });
        } else {
          page.drawText(m.label, { x: x + 10, y: top + h - 24, size: 14, font: helveticaBold, color: hexToRgb(templateConfig.titleColor) });
        }
      }
    } else if (resolveLayout === 'chart-right' || resolveLayout === 'chart-left') {
      const chartX = resolveLayout === 'chart-right' ? 340 : 60;
      const textX0 = resolveLayout === 'chart-right' ? 60 : 340;
      const chartW = 250; const chartH = 170; const chartY = 510;
      page.drawRectangle({ x: chartX, y: chartY, width: chartW, height: chartH, color: hexToRgb(templateConfig.backgroundColor), borderColor: hexToRgb(templateConfig.textColor) });
      // Axes
      page.drawLine({ start: { x: chartX+30, y: chartY+10 }, end: { x: chartX+30, y: chartY+chartH-10 }, color: hexToRgb(templateConfig.textColor), thickness: 1 });
      page.drawLine({ start: { x: chartX+30, y: chartY+10 }, end: { x: chartX+chartW-10, y: chartY+10 }, color: hexToRgb(templateConfig.textColor), thickness: 1 });

      const data = slide.chart && slide.chart.categories?.length && slide.chart.series?.length
        ? { categories: slide.chart.categories, series: slide.chart.series, stacked: !!slide.chart.stacked, showLegend: slide.chart.showLegend ?? (slide.chart.series.length>1) }
        : null;

      if (data) {
        const colors = chartColorsForTemplate(template, data.series.length).map(c => hexToRgb(c));
        const catCount = data.categories.length;
        const serCount = data.series.length;
        const availW = chartW - 50; // leave space for y-axis
        const availH = chartH - 30; // leave space for x-axis
        const gap = 8;
        const groupW = (availW - gap * (catCount + 1)) / catCount;
        const barW = data.stacked ? groupW : (groupW - gap * (serCount - 1)) / serCount;
        // Compute max
        let max = 0;
        for (let i=0;i<catCount;i++) {
          if (data.stacked) {
            let sum = 0; data.series.forEach(s => sum += (s.values[i] || 0));
            max = Math.max(max, sum);
          } else {
            data.series.forEach(s => { max = Math.max(max, s.values[i] || 0); });
          }
        }
        // y ticks
        const ticks = [0,0.25,0.5,0.75,1];
        ticks.forEach(t => {
          const yTick = chartY + 10 + t * (availH);
          try { page.drawText(formatValue(max * t, slide.chart?.yFormat), { x: chartX + 2, y: yTick-4, size: 8, font: helvetica, color: hexToRgb(templateConfig.textColor) }); } catch {}
        });

        for (let i=0;i<catCount;i++) {
          const baseX = chartX + 30 + gap + i * (groupW + gap);
          let stackTop = 0;
          data.series.forEach((s, si) => {
            const v = s.values[i] || 0;
            if (max <= 0) return;
            const h = (v / max) * availH;
            const x = data.stacked ? baseX : baseX + si * (barW + gap);
            const yBar = chartY + 10 + stackTop;
            page.drawRectangle({ x, y: yBar, width: barW, height: h, color: colors[si] });
            if (!data.stacked) {
              const dense = (data.categories.length * data.series.length) > 16 || data.series.length >= 4;
              const pref = slide.chart?.labelStyle || 'auto';
              const useInside = pref === 'inside' || (pref !== 'above' && (dense || h >= 18));
              const yLabel = useInside ? (yBar + Math.max(h - 10, 2)) : (yBar + h + 2);
              const xLabel = x + Math.max(barW / 2 - 6, 0);
              try { page.drawText(formatValue(v, slide.chart?.yFormat), { x: xLabel, y: yLabel, size: 8, font: helvetica, color: hexToRgb(templateConfig.textColor) }); } catch {}
            }
            if (data.stacked) stackTop += h;
          });
          if (data.stacked) {
            try { page.drawText(formatValue(data.series.reduce((sum, s)=> sum + (s.values[i]||0), 0), slide.chart?.yFormat), { x: baseX, y: chartY + 10 + stackTop + 2, size: 8, font: helvetica, color: hexToRgb(templateConfig.textColor) }); } catch {}
          }
          // category labels
          try { page.drawText((slide.chart?.categories[i] || '').slice(0,6), { x: baseX, y: chartY - 12, size: 8, font: helvetica, color: hexToRgb(templateConfig.textColor) }); } catch {}
        }
        // simple legend
        if (data.showLegend) {
          let lx = slide.chart?.legendPosition === 'bottom' ? chartX + 40 : chartX + chartW - 100;
          let ly = slide.chart?.legendPosition === 'bottom' ? chartY - 10 : chartY + chartH - 12;
          data.series.forEach((s, si) => {
            page.drawRectangle({ x: lx, y: ly, width: 10, height: 10, color: colors[si] });
            try { page.drawText(s.name.slice(0,10), { x: lx + 14, y: ly, size: 8, font: helvetica, color: hexToRgb(templateConfig.textColor) }); } catch {}
            if (slide.chart?.legendPosition === 'bottom') lx += 60; else ly -= 14;
          });
        }
        // axis labels
        if (slide.chart?.xLabel) try { page.drawText(slide.chart.xLabel, { x: chartX + chartW/2 - 20, y: chartY - 26, size: 10, font: helvetica, color: hexToRgb(templateConfig.textColor) }); } catch {}
        if (slide.chart?.yLabel) try { page.drawText(slide.chart.yLabel, { x: chartX + 4, y: chartY + chartH/2, size: 10, font: helvetica, color: hexToRgb(templateConfig.textColor) }); } catch {}
      } else {
        const fallback = parseChart(slide.content);
        if (fallback.length) {
          const max = Math.max(...fallback.map(d => d.value));
          const gap = 8; const barW = (chartW - gap * (fallback.length + 1) - 30) / fallback.length; // minus y-axis width
          fallback.forEach((d, i) => {
            const h = max > 0 ? (d.value / max) * (chartH - 30) : 0;
            const x = chartX + 30 + gap + i * (barW + gap);
            const yBar = chartY + 10;
            page.drawRectangle({ x, y: yBar, width: barW, height: h, color: hexToRgb(templateConfig.titleColor) });
            try { page.drawText(d.label.slice(0,6), { x, y: chartY - 12, size: 8, font: helvetica, color: hexToRgb(templateConfig.textColor) }); } catch {}
            try { page.drawText(formatValue(d.value, slide.chart?.yFormat), { x, y: yBar + h + 2, size: 8, font: helvetica, color: hexToRgb(templateConfig.textColor) }); } catch {}
          });
        }
      }
      for (const line of slide.content) {
        page.drawText(`• ${line}`, { x: textX0 + 10, y, size: 12, font: helvetica, color: hexToRgb(templateConfig.textColor), maxWidth: 240 });
        y -= 20;
        if (y < 60) { y = 690; page = pdfDoc.addPage([612, 792]); }
      }
    } else if (y > 0) {
      for (const line of slide.content) {
        page.drawText(`• ${line}`, { x: textX + 10, y, size: 12, font: helvetica, color: hexToRgb(templateConfig.textColor), maxWidth: textW });
        y -= 20;
        if (y < 60) { y = 690; page = pdfDoc.addPage([612, 792]); }
      }
    }

    // Icons row at bottom
    if (slide.icons && slide.icons.length > 0) {
      let x = 60; const yIcons = 80; const w = 28; const h = 28; const gap = 12;
      for (const iconUrl of slide.icons.slice(0, 8)) {
        try {
          const img = await fetchImageForPdf(iconUrl, pdfDoc);
          if (img) { page.drawImage(img, { x, y: yIcons, width: w, height: h }); x += w + gap; }
        } catch (_) { /* ignore */ }
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
}

async function generateWithOllama(
  endpoint: string,
  topic: string,
  slideCount: number,
  tone: string,
  language: string,
  modelName: string
): Promise<Array<{ title: string; content: string[] }>> {
  if (!endpoint) throw new Error('Ollama endpoint is required');
  const url = `${endpoint.replace(/\/$/, '')}/api/generate`;
  const prompt = `Create a ${slideCount}-slide presentation about "${topic}" in ${language}.
The tone should be ${tone}.

For each slide (excluding the title slide), provide:
1. A clear, concise title
2. 3-5 bullet points with key information

Output only a JSON array of objects with this structure:
[
  { "title": "Slide Title", "content": ["Bullet 1", "Bullet 2", "Bullet 3"] }
]

Generate ${slideCount - 1} content slides (the title slide will be added automatically).`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelName || 'llama3.1',
      prompt,
      stream: false,
      options: { temperature: 0.7 },
    }),
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Ollama HTTP ${resp.status}: ${errText}`);
  }
  const data = await resp.json();
  const content: string = data.response || '';
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Failed to parse Ollama JSON response');
  return JSON.parse(jsonMatch[0]);
}

function getTemplateConfig(template: string) {
  const templates: Record<string, {
    primaryColor: string;
    backgroundColor: string;
    titleColor: string;
    subtitleColor: string;
    textColor: string;
  }> = {
    modern: {
      primaryColor: '10B981',
      backgroundColor: 'FFFFFF',
      titleColor: '1F2937',
      subtitleColor: 'FFFFFF',
      textColor: '374151',
    },
    general: {
      primaryColor: '3B82F6',
      backgroundColor: 'FFFFFF',
      titleColor: '1E40AF',
      subtitleColor: 'FFFFFF',
      textColor: '1F2937',
    },
    swift: {
      primaryColor: '8B5CF6',
      backgroundColor: 'FFFFFF',
      titleColor: '5B21B6',
      subtitleColor: 'FFFFFF',
      textColor: '4C1D95',
    },
    minimal: {
      primaryColor: '000000',
      backgroundColor: 'FFFFFF',
      titleColor: '000000',
      subtitleColor: 'FFFFFF',
      textColor: '374151',
    },
    corporate: {
      primaryColor: '1F2937',
      backgroundColor: 'F9FAFB',
      titleColor: '111827',
      subtitleColor: 'FFFFFF',
      textColor: '374151',
    },
  };

  return templates[template] || templates.modern;
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
}

function hexToRgb(hex: string) {
  // hex like 'FFFFFF' -> rgb()
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}

async function fetchImageAsDataUrl(url: string): Promise<{ dataUrl: string; width?: number; height?: number }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Image fetch failed');
  const buf = await res.arrayBuffer();
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const base64 = Buffer.from(buf).toString('base64');
  return { dataUrl: `data:${contentType};base64,${base64}` };
}

async function fetchImageForPdf(url: string, pdfDoc: PDFDocument): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) return null;
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (contentType.includes('png')) return await pdfDoc.embedPng(bytes);
  return await pdfDoc.embedJpg(bytes);
}

function parseMetrics(items: string[]) {
  const out: Array<{label: string; value: number | null; display?: string}> = [];
  const numRe = /([€$£])?\s*([+-]?\d{1,3}(?:[\.,]\d{3})*|[+-]?\d+(?:[\.,]\d+)?)\s*([kKmMbB])?\s*(%|percent|pct)?/;
  for (const raw of items) {
    const s = raw.trim();
    let label = s;
    let value: number | null = null;
    let display: string | undefined;
    const m = s.match(numRe);
    if (m) {
      const currency = m[1] || '';
      const numStr = (m[2] || '').replace(/\./g, '').replace(',', '.');
      const suffix = (m[3] || '').toLowerCase();
      const pct = (m[4] || '').length > 0;
      let v = parseFloat(numStr);
      if (!isNaN(v)) {
        if (suffix === 'k') v *= 1e3;
        if (suffix === 'm') v *= 1e6;
        if (suffix === 'b') v *= 1e9;
        value = v;
        label = s.replace(numRe, '').replace(/[:\-–]+$/, '').trim() || 'Metric';
        const compact = suffix ? (parseFloat(numStr) + suffix) : formatNumber(v);
        display = `${currency || ''}${compact}${pct ? '%' : ''}`;
      }
    }
    if (value === null) out.push({ label: s, value: null });
    else out.push({ label, value, display });
  }
  return out;
}

function parseChart(items: string[]) {
  const pairs: Array<{label: string; value: number}> = [];
  const expanded: string[] = [];
  items.forEach(line => {
    if (line.includes(',')) expanded.push(...line.split(',').map(s => s.trim()));
    else expanded.push(line.trim());
  });
  for (const s of expanded) {
    const m = s.match(/^([^:]+?)\s*[:\s]\s*([€$£]?\s*[+-]?\d{1,3}(?:[\.,]\d{3})*|[+-]?\d+(?:[\.,]\d+)?)(\s*[kKmMbB])?\s*(%|percent|pct)?/);
    if (m) {
      const label = m[1].trim();
      const rawNum = (m[2] || '').replace(/\./g, '').replace(',', '.').replace(/[€$£\s]/g, '');
      let num = parseFloat(rawNum);
      const suffix = (m[3] || '').trim().toLowerCase();
      if (suffix === 'k') num *= 1e3; if (suffix === 'm') num *= 1e6; if (suffix === 'b') num *= 1e9;
      if (!isNaN(num)) pairs.push({ label, value: num });
    }
  }
  return pairs;
}

function formatNumber(n: number) {
  try { return new Intl.NumberFormat('en-US').format(n); } catch { return String(n); }
}

function formatValue(v: number, fmt?: ChartData['yFormat']) {
  if (!fmt || fmt === 'auto') return formatNumber(v);
  if (fmt === 'currency') try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v); } catch { return `$${formatNumber(v)}`; }
  if (fmt === 'percent') try { return new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 0 }).format(v); } catch { return `${Math.round(v*100)}%`; }
  return formatNumber(v);
}

function chartColorsForTemplate(template: string, n: number): string[] {
  const palettes: Record<string, string[]> = {
    modern: ['#10B981','#059669','#34D399','#0EA5E9','#F59E0B','#EF4444'],
    general: ['#3B82F6','#1D4ED8','#60A5FA','#22C55E','#F59E0B','#EF4444'],
    swift: ['#8B5CF6','#6D28D9','#A78BFA','#EC4899','#F59E0B','#22C55E'],
    minimal: ['#000000','#4B5563','#9CA3AF','#10B981','#3B82F6','#F59E0B'],
    corporate: ['#1F2937','#374151','#6B7280','#10B981','#3B82F6','#F59E0B'],
  };
  const base = palettes[template] || palettes.modern;
  const out: string[] = [];
  for (let i=0;i<n;i++) out.push(base[i % base.length].replace('#',''));
  return out;
}

async function buildHiFiPdf(html: string): Promise<Uint8Array> {
  try {
    const puppeteer = await import('puppeteer').then(m => (m as any).default || (m as any));
    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buf = await page.pdf({ printBackground: true, width: '1280px', height: '720px' });
    await browser.close();
    return new Uint8Array(buf);
  } catch (e) {
    // Fallback to Playwright (host-ready on some platforms)
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pw = await import('playwright').then(m => (m as any).chromium || (m as any));
      const browser = await pw.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.setContent(html, { waitUntil: 'load' });
      const buf = await page.pdf({ printBackground: true, width: '1280px', height: '720px' } as any);
      await browser.close();
      return new Uint8Array(buf as any);
    } catch (e2) {
      throw e2;
    }
  }
}

async function buildHtmlFromSlides(
  topic: string,
  slides: SlideInput[],
  template: string,
  templateFonts?: { titleFontUrl?: string; bodyFontUrl?: string; titleFontName?: string; bodyFontName?: string }
): Promise<string> {
  const colors = getTemplateConfig(template);
  const titleFontName = templateFonts?.titleFontName || 'CustomTitle';
  const bodyFontName = templateFonts?.bodyFontName || 'CustomBody';
  const titleFace = templateFonts?.titleFontUrl ? `@font-face{font-family:'${titleFontName}';src:url('${templateFonts.titleFontUrl}') format('woff2');font-weight:normal;font-style:normal;font-display:swap;}` : '';
  const bodyFace = templateFonts?.bodyFontUrl ? `@font-face{font-family:'${bodyFontName}';src:url('${templateFonts.bodyFontUrl}') format('woff2');font-weight:normal;font-style:normal;font-display:swap;}` : '';
  const esc = (s: string) => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const slideHtml = slides.map(s => {
    const layout = s.layout || (s.imageUrl ? 'image-right' : 'text');
    const bullets = s.content.map(c => `<li>${esc(c)}</li>`).join('');
    const icons = (s.icons || []).map(u => `<img src="${esc(u)}" style="width:18px;height:18px;object-fit:contain;margin-right:6px;"/>`).join('');
    const img = s.imageUrl ? `<img src="${esc(s.imageUrl)}" class="img"/>` : `<div class="img ph"></div>`;
    const chart = (() => {
      if (s.chart && s.chart.categories?.length && s.chart.series?.length) {
        const cat = s.chart.categories;
        const ser = s.chart.series;
        const colorsArr = chartColorsForTemplate(template, ser.length).map(c => `#${c}`);
        const legend = (s.chart.showLegend ?? (ser.length>1)) ? `<div class=\"legend\">${ser.map((ss, i)=>`<div><span style=\"background:${colorsArr[i]}\"></span>${esc(ss.name)}</div>`).join('')}</div>` : '';
        if (s.chart.type === 'bar') {
          const max = (()=>{
            let m = 0;
            for (let i=0;i<cat.length;i++) {
              if (s.chart!.stacked) {
                let sum = 0; ser.forEach(ss=> sum += (ss.values[i]||0));
                m = Math.max(m, sum);
              } else {
                ser.forEach(ss=> m = Math.max(m, ss.values[i]||0));
              }
            }
            return m;
          })();
          const yTicks = [0,0.25,0.5,0.75,1].map(f=> Math.round(f*max));
          const bars = cat.map((label, ci) => {
            if (s.chart!.stacked) {
              let accPct = 0;
              const segs = ser.map((ss, si) => {
                const v = ss.values[ci]||0; const h = max>0 ? Math.max(4, Math.round((v/max)*100)) : 0;
                accPct += h; return `<div class=\"seg\" style=\"background:${colorsArr[si]};height:${h}%\"></div>`;
              }).join('');
              const total = ser.reduce((sum, ss)=> sum + (ss.values[ci]||0), 0);
              const labelEl = `<span class=\"val above\" style=\"bottom: calc(${Math.min(accPct,100)}% + 2px)\">${esc(formatValue(total, s.chart?.yFormat))}</span>`;
              const group = `<div class=\"stack\" style=\"position:relative\">${segs}${labelEl}</div>`;
              return `<div class=\"cat\"><div class=\"col\">${group}</div><span class=\"xlabel\">${esc(label)}</span></div>`;
            } else {
              const cols = ser.map((ss, si) => {
                const v = ss.values[ci]||0; const h = max>0 ? Math.max(4, Math.round((v/max)*100)) : 0;
                const dense = (cat.length * ser.length) > 16 || ser.length >= 4;
                const pref = s.chart!.labelStyle || 'auto';
                const useInside = pref === 'inside' || (pref !== 'above' && (dense || h >= 18));
                const lbl = useInside
                  ? `<span class=\"val inside\" style=\"bottom: calc(${h}% - 12px)\">${esc(formatValue(v, s.chart?.yFormat))}</span>`
                  : `<span class=\"val above\" style=\"bottom: calc(${h}% + 2px)\">${esc(formatValue(v, s.chart?.yFormat))}</span>`;
                return `<div class=\"barwrap\"><div class=\"bar\" style=\"background:${colorsArr[si]};height:${h}%\"></div>${lbl}</div>`;
              }).join('');
              const group = `<div class=\"cluster\">${cols}</div>`;
              return `<div class=\"cat\"><div class=\"col\" style=\"position:relative\">${group}</div><span class=\"xlabel\">${esc(label)}</span></div>`;
            }
          }).join('');
          const ticks = yTicks.map(v=> `<div class=\"tick\"><span>${esc(formatValue(v, s.chart?.yFormat))}</span></div>`).join('');
          const useRight = s.chart.legendPosition === 'right';
          const legendHtml = (s.chart.legendPosition === 'bottom' || useRight) ? '' : legend;
          const bottomLegend = (s.chart.legendPosition === 'bottom') ? legend : '';
          const rightLegend = useRight ? legend.replace('<div class=\\"legend\\">','<div class=\\"legend legend-right\\">') : '';
          const cls = useRight ? 'chart ygrid with-right-legend' : 'chart ygrid';
          return `<div class=\"${cls}\"><div class=\"yticks\">${ticks}</div><div class=\"groups\">${bars}</div>${legendHtml}${bottomLegend}${rightLegend}</div>`;
        }
        if (s.chart.type === 'line') {
          const max = Math.max(...ser.flatMap(ss=> ss.values));
          const w = 520, h = 360, pad = 30;
          const stepX = (w - pad*2) / Math.max(1, cat.length-1);
          const color = (i:number)=> colorsArr[i];
          const grid = Array.from({length:5}).map((_,i)=>{
            const y = pad + i*((h-pad*2)/4);
            return `<line x1=\"${pad}\" y1=\"${y}\" x2=\"${w-pad}\" y2=\"${y}\" stroke=\"#${colors.titleColor}22\" stroke-width=\"1\" />`;
          }).join('');
          const polylines = ser.map((ss, i) => {
            const pts = ss.values.map((v, idx) => {
              const x = pad + idx*stepX;
              const y = h - pad - (max>0 ? (v/max)*(h-pad*2) : 0);
              return `${x},${y}`;
            }).join(' ');
            return `<polyline fill=\"none\" stroke=\"${color(i)}\" stroke-width=\"2\" points=\"${pts}\" />`;
          }).join('');
          const markers = ser.map((ss, i) => ss.values.map((v, idx) => {
            const x = pad + idx*stepX;
            const y = h - pad - (max>0 ? (v/max)*(h-pad*2) : 0);
            return `<circle cx=\"${x}\" cy=\"${y}\" r=\"3\" fill=\"${color(i)}\" />`;
          }).join('')).join('');
          const labels = ser.map((ss, i) => ss.values.map((v, idx) => {
            const x = pad + idx*stepX;
            const y = h - pad - (max>0 ? (v/max)*(h-pad*2) : 0) - 6;
            return `<text x=\"${x}\" y=\"${y}\" font-size=\"10\" fill=\"#${colors.textColor}\" text-anchor=\"middle\">${esc(formatValue(v, s.chart?.yFormat))}</text>`;
          }).join('')).join('');
          const xlabels = cat.map((c, idx)=> `<text x=\"${pad + idx*stepX}\" y=\"${h - 8}\" font-size=\"10\" fill=\"#${colors.textColor}\" text-anchor=\"middle\">${esc(c)}</text>`).join('');
          return `<div class=\"chart svgchart\"><svg width=\"100%\" height=\"360\" viewBox=\"0 0 ${w} ${h}\">${grid}${polylines}${markers}${labels}${xlabels}</svg>${legend}</div>`;
        }
        if (s.chart.type === 'pie' || s.chart.type === 'doughnut') {
          const series = ser[0] || { name: 'Series', values: [] };
          const total = series.values.reduce((a,b)=>a+b,0) || 1;
          let acc = 0;
          const radius = 150; const cx = 260; const cy = 190; const inner = s.chart.type==='doughnut' ? 90 : 0;
          const slices = series.values.map((v, i) => {
            const frac = v/total; const start = acc; acc += frac;
            const a0 = start*2*Math.PI, a1 = acc*2*Math.PI;
            const x0 = cx + radius*Math.cos(a0), y0 = cy + radius*Math.sin(a0);
            const x1 = cx + radius*Math.cos(a1), y1 = cy + radius*Math.sin(a1);
            const large = (a1 - a0) > Math.PI ? 1 : 0;
            const outerArc = `M ${cx} ${cy} L ${x0} ${y0} A ${radius} ${radius} 0 ${large} 1 ${x1} ${y1} Z`;
            const fill = colorsArr[i % colorsArr.length];
            return `<path d=\"${outerArc}\" fill=\"${fill}\" />`;
          }).join('');
          // labels: at middle angle
          acc = 0;
          const sliceLabels = series.values.map((v, i) => {
            const start = acc; const frac = v/total; acc += frac;
            const ang = (start + frac/2) * 2*Math.PI;
            const r = inner ? (inner + radius)/2 : radius*0.65;
            const lx = cx + r*Math.cos(ang);
            const ly = cy + r*Math.sin(ang);
            const pct = Math.round((v/total)*100);
            return `<text x=\"${lx}\" y=\"${ly}\" font-size=\"12\" fill=\"#${colors.titleColor}\" text-anchor=\"middle\">${pct}%</text>`;
          }).join('');
          const hole = inner ? `<circle cx=\"${cx}\" cy=\"${cy}\" r=\"${inner}\" fill=\"#${colors.backgroundColor}\" />` : '';
          const legendItems = cat.map((c, i)=> `<div><span style=\"background:${colorsArr[i % colorsArr.length]}\"></span>${esc(c)}</div>`).join('');
          return `<div class=\"chart pie\"><svg width=\"100%\" height=\"360\" viewBox=\"0 0 520 380\">${slices}${hole}${sliceLabels}</svg><div class=\"legend\">${legendItems}</div></div>`;
        }
      }
      const data = parseChart(s.content);
      if (!data.length) return '<div class="chart ph"></div>';
      const max = Math.max(...data.map(d => d.value));
      const bars = data.map(d => {
        const h = max > 0 ? Math.max(4, Math.round((d.value / max) * 100)) : 0;
        return `<div class="bar" style="height:${h}%" title="${esc(d.label)}: ${d.value}"></div>`;
      }).join('');
      return `<div class="chart"><div class="bars">${bars}</div><div class="labels">${data.map(d=>`<span>${esc(d.label.slice(0,6))}</span>`).join('')}</div></div>`;
    })();
    const metrics = (() => {
      const arr = parseMetrics(s.content).slice(0,3);
      return `<div class="grid3">${arr.map(mm=>`<div class="metric"><div class="num">${mm.display ?? ''}</div><div class="label">${esc(mm.label)}</div></div>`).join('')}</div>`;
    })();
    return `
    <section class="slide ${layout}">
      <h2 class="title">${esc(s.title)}</h2>
      ${layout === 'text' ? `<ul class="bullets">${bullets}</ul>` : ''}
      ${layout === 'image-right' ? `<div class="left"><ul class="bullets">${bullets}</ul></div><div class="right">${img}</div>` : ''}
      ${layout === 'image-left' ? `<div class="left">${img}</div><div class="right"><ul class="bullets">${bullets}</ul></div>` : ''}
      ${layout === 'two-column' ? (()=>{ const mid=Math.ceil(s.content.length/2); const left = s.content.slice(0,mid).map(c=>`<li>${esc(c)}</li>`).join(''); const right=s.content.slice(mid).map(c=>`<li>${esc(c)}</li>`).join(''); return `<div class="left"><ul class="bullets">${left}</ul></div><div class="right"><ul class="bullets">${right}</ul></div>` })() : ''}
      ${layout === 'quote' ? `<blockquote>“${esc(s.content[0] || '')}”</blockquote>` : ''}
      ${layout === 'title-only' ? `<div class="spacer"></div>` : ''}
      ${layout === 'image-full' ? `<div class="full">${img}</div>` : ''}
      ${layout === 'metrics-3' ? metrics : ''}
      ${layout === 'chart-right' || layout === 'chart-left' ? `<div class="${layout==='chart-right'?'left':'right'}"><ul class="bullets">${bullets}</ul></div><div class="${layout==='chart-right'?'right':'left'}">${chart}</div>` : ''}
      <div class="icons">${icons}</div>
    </section>`;
  }).join('\n');

  const html = `<!doctype html><html><head><meta charset="utf-8" />
  <style>
    ${titleFace}
    ${bodyFace}
    :root{ --primary:#${colors.primaryColor}; --bg:#${colors.backgroundColor}; --title:#${colors.titleColor}; --text:#${colors.textColor}; }
    *{ box-sizing:border-box; }
    body{ margin:0; background:#f8fafc; font-family: ${templateFonts?.bodyFontUrl ? `'${bodyFontName}',` : ''} system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, 'Apple Color Emoji','Segoe UI Emoji';}
    .slide{ width:1280px; height:720px; padding:40px; background:#${colors.backgroundColor}; position:relative; page-break-after: always; }
    .title{ margin:0 0 20px; color:#${colors.titleColor}; font-size:38px; font-weight:800; ${templateFonts?.titleFontUrl ? `font-family:'${titleFontName}', inherit;` : ''} }
    .bullets{ margin:0; padding-left:18px; color:#${colors.textColor}; font-size:20px; }
    .left{ width:50%; float:left; padding-right:16px; }
    .right{ width:50%; float:right; padding-left:16px; }
    .img{ width:100%; height:320px; object-fit:cover; border:2px solid #${colors.titleColor}20; border-radius:8px; }
    .img.ph{ background: #${colors.primaryColor}33; }
    .full .img{ width:100%; height:100%; }
    blockquote{ color:#${colors.textColor}; font-size:28px; font-style:italic; margin:80px 40px; }
    .spacer{ height:400px; }
    .icons{ position:absolute; left:40px; right:40px; bottom:24px; display:flex; gap:8px; }
    .grid3{ display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; }
    .metric{ border:2px solid #${colors.titleColor}20; border-radius:8px; padding:16px; }
    .metric .num{ color:#${colors.titleColor}; font-size:36px; font-weight:800; line-height:1; }
    .metric .label{ color:#${colors.textColor}; font-size:16px; margin-top:6px; }
    .chart{ height:340px; border:2px solid #${colors.titleColor}20; border-radius:8px; padding:8px; position:relative; background:#fff; }
    .chart.ph{ background:#${colors.primaryColor}22; }
    .ygrid{ display:block; }
    .yticks{ position:absolute; left:0; top:8px; bottom:28px; width:40px; display:flex; flex-direction:column; justify-content:space-between; }
    .tick{ font-size:10px; color:#${colors.textColor}; text-align:right; padding-right:4px; }
    .groups{ position:absolute; left:48px; right:8px; top:8px; bottom:28px; display:flex; gap:12px; }
    .with-right-legend .groups{ right:140px; }
    .cat{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; }
    .col{ width:100%; height:100%; display:flex; align-items:flex-end; gap:6px; position:relative; }
    .cluster{ display:flex; align-items:flex-end; gap:6px; width:100%; }
    .barwrap{ position:relative; flex:1; }
    .cluster .bar{ flex:1; border-radius:4px 4px 0 0; }
    .stack{ width:100%; display:flex; flex-direction:column; justify-content:flex-end; gap:2px; }
    .stack .seg{ border-radius:2px; }
    .val{ position:absolute; font-size:10px; color:#${colors.textColor}; transform:translate(-50%, 0); left:50%; white-space:nowrap; }
    .val.inside{ color:#fff; font-weight:600; text-shadow:0 1px 2px #0003; }
    .xlabel{ font-size:10px; color:#${colors.textColor}; margin-top:4px; display:block; max-width:80px; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .legend{ position:absolute; top:8px; right:8px; background:#ffffffcc; border:1px solid #${colors.titleColor}20; border-radius:6px; padding:6px 8px; display:flex; flex-direction:column; gap:4px; }
    .legend-right{ top:8px; bottom:28px; width:120px; overflow:auto; }
    .legend div{ display:flex; align-items:center; gap:6px; font-size:11px; color:#${colors.textColor}; }
    .legend span{ width:10px; height:10px; display:inline-block; border-radius:2px; }
    .bars{ display:flex; align-items:flex-end; gap:12px; height:100%; }
    .bar{ width:40px; background:#${colors.primaryColor}; border:2px solid #${colors.titleColor}20; border-radius:4px 4px 0 0; }
    .labels{ display:flex; gap:12px; justify-content:space-between; font-size:12px; color:#${colors.textColor}; margin-top:8px; }
    .svgchart{ padding:8px; }
    .pie .legend{ position:static; margin-top:8px; display:flex; flex-direction:row; gap:12px; flex-wrap:wrap; }
    .slide:after{ content:""; display:block; clear:both; }
  </style></head><body>
  <section class="slide" style="background:#${colors.primaryColor}"><h1 style="color:#${colors.subtitleColor};font-size:44px;margin:220px 40px 0;text-align:center">${esc(topic)}</h1></section>
  ${slideHtml}
  </body></html>`;
  return html;
}

async function ensureStorageBucket() {
  await withSupabaseAdmin(async (client) => {
    if (!client) return;
    const { data: buckets } = await client.storage.listBuckets();
    const has = (buckets || []).some((b) => b.name === 'presentations');
    if (!has) {
      await client.storage.createBucket('presentations', { public: false });
    }
    return undefined as any;
  });
}

async function persistPresentation(params: {
  buffer: Uint8Array;
  topic: string;
  slideCount: number;
  template: string;
  tone: string;
  language: string;
  provider: string;
  model: string;
  exportAs: 'pptx' | 'pdf';
}) {
  try {
    const supabase = createSupabaseAdminClient();
    await ensureStorageBucket();
    const id = crypto.randomUUID();
    const ext = params.exportAs === 'pdf' ? 'pdf' : 'pptx';
    const storagePath = `${id}.${ext}`;
    const { error: upErr } = await supabase
      .storage
      .from('presentations')
      .upload(storagePath, params.buffer, {
        contentType: params.exportAs === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        upsert: false,
      });
    if (upErr) throw upErr;

    const { error: insErr } = await supabase.from('presentations_ai').insert({
      id,
      topic: params.topic.slice(0, 1000),
      slide_count: params.slideCount,
      template: params.template,
      tone: params.tone,
      language: params.language,
      provider: params.provider,
      model: params.model,
      export_format: params.exportAs,
      storage_path: storagePath,
    });
    if (insErr) throw insErr;
  } catch (e) {
    console.warn('Persist presentation skipped:', (e as Error)?.message);
  }
}
