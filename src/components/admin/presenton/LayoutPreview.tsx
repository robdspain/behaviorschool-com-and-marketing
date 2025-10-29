"use client";

interface Props {
  layout: 'auto'|'text'|'image-right'|'image-left'|'two-column'|'quote'|'title-only'|'image-full'|'metrics-3'|'chart-right'|'chart-left';
  imageUrl?: string;
  titleText?: string;
  content?: string[];
  icons?: string[];
  template?: 'modern'|'general'|'swift'|'minimal'|'corporate'|string;
  variant?: 'small'|'large';
  className?: string;
}

// A lightweight visual preview of slide layouts using simple blocks.
export default function LayoutPreview({ layout, imageUrl, titleText, content, icons, template = 'modern', variant = 'small', className }: Props) {
  const colors = getTemplateColors(template);
  const sizes = getSizes(variant);
  // 16:9 aspect box
  return (
    <div className={`relative w-full border rounded-md overflow-hidden ${className || ''}`}
         style={{ aspectRatio: '16 / 9', backgroundColor: colors.previewBg, borderColor: colors.border }}>
      {/* Title bar */}
      {layout !== 'image-full' && (
        <div className="absolute left-3 right-3 truncate" style={{ color: colors.title, fontWeight: 700, fontSize: sizes.title, top: sizes.titleTop }}>
          {titleText || 'Slide Title'}
        </div>
      )}

      {renderBody({ layout, hasImage: !!imageUrl, colors, titleText, content, imageUrl, sizes })}

      {/* Icons row preview */}
      {layout !== 'image-full' && (
        <div className="absolute left-3 right-3 flex items-center gap-2" style={{ bottom: sizes.iconsBottom }}>
          {renderIconsRow(icons, colors)}
        </div>
      )}
    </div>
  );
}

function renderBullets(textColor: string, items?: string[], max = 6, fontSize = 9) {
  const lines = (items && items.length ? items : ['First point', 'Second point', 'Third point', 'Fourth point']).slice(0, max);
  return (
    <div className="space-y-1" style={{ fontSize, color: textColor }}>
      {lines.map((t, i) => (
        <div key={i} className="truncate">• {t}</div>
      ))}
    </div>
  );
}

function ImgBox({ src, colors }: { src?: string; colors: ReturnType<typeof getTemplateColors> }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className="w-full h-full object-cover rounded" style={{ border: `1px solid ${colors.border}` }} />;
  }
  return <div className="w-full h-full rounded" style={{ backgroundColor: colors.image, border: `1px solid ${colors.border}` }} />;
}

function renderBody({ layout, hasImage, colors, titleText, content, imageUrl, sizes }: { layout: Props['layout']; hasImage: boolean; colors: ReturnType<typeof getTemplateColors>; titleText?: string; content?: string[]; imageUrl?: string; sizes: ReturnType<typeof getSizes>; }) {
  
  if (layout === 'image-full') {
    return (
      <div className="absolute inset-0">
        <ImgBox src={imageUrl} colors={colors} />
      </div>
    );
  }

  if (layout === 'title-only') {
    return null;
  }

  if (layout === 'text' || (layout === 'auto' && !hasImage)) {
    return <div className="absolute left-3 right-3" style={{ top: sizes.bodyTop, bottom: sizes.bodyBottom }}>{renderBullets(colors.text, content, 6, sizes.bullet)}</div>;
  }

  if (layout === 'image-right' || (layout === 'auto' && hasImage)) {
    return (
      <div className="absolute left-3 right-3 grid grid-cols-2 gap-2" style={{ top: sizes.bodyTop, bottom: sizes.bodyBottom }}>
        <div>{renderBullets(colors.text, content, 6, sizes.bullet)}</div>
        <div className="rounded overflow-hidden"><ImgBox src={imageUrl} colors={colors} /></div>
      </div>
    );
  }

  if (layout === 'image-left') {
    return (
      <div className="absolute left-3 right-3 grid grid-cols-2 gap-2" style={{ top: sizes.bodyTop, bottom: sizes.bodyBottom }}>
        <div className="rounded overflow-hidden"><ImgBox src={imageUrl} colors={colors} /></div>
        <div>{renderBullets(colors.text, content, 6, sizes.bullet)}</div>
      </div>
    );
  }

  if (layout === 'two-column') {
    return (
      <div className="absolute left-3 right-3 grid grid-cols-2 gap-2" style={{ top: sizes.bodyTop, bottom: sizes.bodyBottom }}>
        <div>{renderBullets(colors.text, content, 6, sizes.bullet)}</div>
        <div>{renderBullets(colors.text, content?.slice(Math.ceil((content?.length || 0)/2)), 6, sizes.bullet)}</div>
      </div>
    );
  }

  if (layout === 'metrics-3') {
    // Show 3 metric boxes with lines
    return (
      <div className="absolute left-3 right-3 grid grid-cols-3 gap-2" style={{ top: sizes.bodyTop, bottom: sizes.bodyBottom }}>
        {[0,1,2].map((idx) => (
          <div key={idx} className="rounded p-2" style={{ backgroundColor: hexToRgba(colors.primary, 0.08), border: `1px solid ${colors.border}` }}>
            <div className="font-bold truncate" style={{ color: colors.title, fontSize: sizes.bullet + 2 }}>{(content && content[idx]) || 'Metric'}</div>
            <div className="mt-1 h-2 rounded" style={{ backgroundColor: colors.textDim }} />
          </div>
        ))}
      </div>
    );
  }

  if (layout === 'chart-right' || layout === 'chart-left') {
    const leftBullets = <div>{renderBullets(colors.text, content, 6, sizes.bullet)}</div>;
    const chartBox = (
      <div className="rounded overflow-hidden grid grid-rows-6 grid-cols-6 gap-0.5 p-1" style={{ backgroundColor: hexToRgba(colors.primary, 0.08), border: `1px solid ${colors.border}` }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} className="bg-white" style={{ backgroundColor: i % 2 ? hexToRgba(colors.primary, 0.2) : hexToRgba(colors.primary, 0.1) }} />
        ))}
      </div>
    );
    return (
      <div className="absolute left-3 right-3 grid grid-cols-2 gap-2" style={{ top: sizes.bodyTop, bottom: sizes.bodyBottom }}>
        {layout === 'chart-left' ? (<>
          <div>{chartBox}</div>
          {leftBullets}
        </>) : (<>
          {leftBullets}
          <div>{chartBox}</div>
        </>)}
      </div>
    );
  }

  if (layout === 'quote') {
    return (
      <div className="absolute left-6 right-6 flex items-center justify-center" style={{ top: sizes.quoteTop, bottom: sizes.quoteBottom }}>
        <div className="text-center" style={{ color: colors.text, fontSize: sizes.quote, fontStyle: 'italic' }}>
          “{(content && content[0]) || 'A concise, compelling quote goes here.'}”
        </div>
      </div>
    );
  }

  return null;
}

function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getTemplateColors(template: string) {
  const map: Record<string, { primary: string; bg: string; title: string; text: string; border: string }> = {
    modern:   { primary: '#10B981', bg: '#FFFFFF', title: '#1F2937', text: '#374151', border: '#D1D5DB' },
    general:  { primary: '#3B82F6', bg: '#FFFFFF', title: '#1E40AF', text: '#1F2937', border: '#D1D5DB' },
    swift:    { primary: '#8B5CF6', bg: '#FFFFFF', title: '#5B21B6', text: '#4C1D95', border: '#D1D5DB' },
    minimal:  { primary: '#000000', bg: '#FFFFFF', title: '#000000', text: '#374151', border: '#D1D5DB' },
    corporate:{ primary: '#1F2937', bg: '#F9FAFB', title: '#111827', text: '#374151', border: '#D1D5DB' },
  };
  const c = map[template] || map.modern;
  return {
    primary: c.primary,
    previewBg: c.bg,
    title: c.title,
    text: c.text,
    textDim: hexToRgba(c.text, 0.5),
    image: hexToRgba(c.primary, 0.25),
    border: c.border,
  };
}

function getSizes(variant: 'small'|'large') {
  if (variant === 'large') {
    return {
      title: 14,
      titleTop: 8,
      bullet: 12,
      bodyTop: 34,
      bodyBottom: 30,
      quote: 16,
      quoteTop: 60,
      quoteBottom: 30,
      iconsBottom: 8,
    } as const;
  }
  return {
    title: 10,
    titleTop: 6,
    bullet: 9,
    bodyTop: 28,
    bodyBottom: 24,
    quote: 12,
    quoteTop: 48,
    quoteBottom: 24,
    iconsBottom: 6,
  } as const;
}

function renderIconsRow(icons: string[] | undefined, colors: ReturnType<typeof getTemplateColors>) {
  const items = (icons && icons.length ? icons : new Array(4).fill(''));
  return (
    <div className="flex items-center gap-2">
      {items.slice(0, 6).map((u, i) => (
        <div key={i} className="w-4 h-4 rounded overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
          {u ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={u} alt="" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: colors.image }} />
          )}
        </div>
      ))}
    </div>
  );
}
