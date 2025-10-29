"use client";

import { useState } from 'react';

type ChartData = {
  type: 'bar'|'line'|'pie'|'doughnut';
  categories: string[];
  series: Array<{ name: string; values: number[] }>;
  stacked?: boolean;
  showLegend?: boolean;
  xLabel?: string;
  yLabel?: string;
  seriesColors?: string[];
  legendPosition?: 'top-right'|'bottom'|'right'|'left';
  yFormat?: 'auto'|'number'|'currency'|'percent';
  labelStyle?: 'auto'|'inside'|'above';
  showStackPercent?: boolean;
};

export default function ChartEditor({ initial, onSave, onClose, template = 'modern' }: { initial?: ChartData; onSave: (data: ChartData) => void; onClose: () => void; template?: 'modern'|'general'|'swift'|'minimal'|'corporate'|string; }) {
  const [type, setType] = useState<ChartData['type']>(initial?.type || 'bar');
  const [categories, setCategories] = useState<string>((initial?.categories || []).join(', '));
  const [series, setSeries] = useState<Array<{ name: string; values: string }>>(
    (initial?.series || [{ name: 'Series 1', values: [] }]).map(s => ({ name: s.name, values: s.values.join(', ') }))
  );
  const [stacked, setStacked] = useState<boolean>(!!initial?.stacked);
  const [showLegend, setShowLegend] = useState<boolean>(initial?.showLegend ?? true);
  const [xLabel, setXLabel] = useState<string>(initial?.xLabel || '');
  const [yLabel, setYLabel] = useState<string>(initial?.yLabel || '');
  const [seriesColors, setSeriesColors] = useState<string>((initial?.seriesColors || []).join(', '));
  const [legendPosition, setLegendPosition] = useState<'top-right'|'bottom'|'right'|'left'>(initial?.legendPosition || 'top-right');
  const [yFormat, setYFormat] = useState<'auto'|'number'|'currency'|'percent'>(initial?.yFormat || 'auto');
  const [labelStyle, setLabelStyle] = useState<'auto'|'inside'|'above'>(initial?.labelStyle || 'auto');
  const [showStackPercent, setShowStackPercent] = useState<boolean>(!!initial?.showStackPercent);
  const [csv, setCsv] = useState<string>('');

  const addSeries = () => setSeries(arr => [...arr, { name: `Series ${arr.length+1}`, values: '' }]);
  const removeSeries = (i: number) => setSeries(arr => arr.filter((_, idx) => idx !== i));
  const updateSeries = (i: number, key: 'name'|'values', value: string) => setSeries(arr => arr.map((s, idx) => idx === i ? { ...s, [key]: value } : s));

  const save = () => {
    const cats = categories.split(',').map(s => s.trim()).filter(Boolean);
    const ser = series.map(s => ({ name: s.name.trim() || 'Series', values: s.values.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v)) }));
    const colors = seriesColors.split(',').map(s => s.trim()).filter(Boolean);
    onSave({ type, categories: cats, series: ser, stacked, showLegend, xLabel: xLabel || undefined, yLabel: yLabel || undefined, seriesColors: colors.length ? colors : undefined, legendPosition, yFormat, labelStyle, showStackPercent });
  };

  const parseCsv = () => {
    try {
      const rows = parseCsvString(csv);
      if (!rows.length) return;
      const header = rows[0];
      const cats = header.slice(1).map(s => s.trim()).filter(Boolean);
      const ser: Array<{ name: string; values: string }> = [];
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i];
        const name = (cols[0] || `Series ${i}`).trim();
        const vals = cols.slice(1).map(s => s.trim()).join(', ');
        ser.push({ name, values: vals });
      }
      setCategories(cats.join(', '));
      setSeries(ser);
    } catch (e) {
      alert('CSV parse failed. Expected format: first row categories, subsequent rows: series name + values');
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 max-w-3xl w-full max-h-[85vh] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-200">
            <h4 className="text-lg font-bold text-slate-900">Edit Chart</h4>
            <button onClick={onClose} className="px-3 py-1 border-2 border-slate-200 rounded">Close</button>
          </div>
          <div className="p-4 space-y-4 overflow-auto">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Type</label>
                <select value={type} onChange={(e)=> setType(e.target.value as any)} className="w-full px-3 py-2 border-2 border-slate-200 rounded">
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="pie">Pie</option>
                  <option value="doughnut">Doughnut</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-900 mb-1">Categories (comma-separated)</label>
                <input value={categories} onChange={(e)=> setCategories(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" placeholder="Jan, Feb, Mar" />
              </div>
            </div>
            {/* Live Preview */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Live Preview</label>
              <ChartPreview
                type={type}
                categories={categories.split(',').map(s=>s.trim()).filter(Boolean)}
                series={series.map(s=> ({ name: s.name, values: s.values.split(',').map(v=> parseFloat(v.trim())).filter(v=>!isNaN(v)) }))}
                stacked={stacked}
                legendPosition={legendPosition}
                yFormat={yFormat}
                template={template}
                seriesColors={seriesColors.split(',').map(s=>s.trim()).filter(Boolean)}
              />
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Stacked</label>
                <select value={stacked ? 'yes' : 'no'} onChange={(e)=> setStacked(e.target.value==='yes')} className="w-full px-3 py-2 border-2 border-slate-200 rounded">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Legend</label>
                <select value={showLegend ? 'show' : 'hide'} onChange={(e)=> setShowLegend(e.target.value==='show')} className="w-full px-3 py-2 border-2 border-slate-200 rounded">
                  <option value="show">Show</option>
                  <option value="hide">Hide</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">X Axis Label</label>
                <input value={xLabel} onChange={(e)=> setXLabel(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Y Axis Label</label>
                <input value={yLabel} onChange={(e)=> setYLabel(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Legend Position</label>
              <select value={legendPosition} onChange={(e)=> setLegendPosition(e.target.value as any)} className="w-full px-3 py-2 border-2 border-slate-200 rounded">
                <option value="top-right">Top Right</option>
                <option value="bottom">Bottom</option>
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Y Format</label>
                <select value={yFormat} onChange={(e)=> setYFormat(e.target.value as any)} className="w-full px-3 py-2 border-2 border-slate-200 rounded">
                  <option value="auto">Auto</option>
                  <option value="number">Number</option>
                  <option value="currency">Currency</option>
                  <option value="percent">Percent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Label Style</label>
                <select value={labelStyle} onChange={(e)=> setLabelStyle(e.target.value as any)} className="w-full px-3 py-2 border-2 border-slate-200 rounded">
                  <option value="auto">Auto</option>
                  <option value="inside">Inside</option>
                  <option value="above">Above</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Stacked % Labels</label>
                <select value={showStackPercent ? 'yes':'no'} onChange={(e)=> setShowStackPercent(e.target.value==='yes')} className="w-full px-3 py-2 border-2 border-slate-200 rounded">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-900">Series</label>
              <button onClick={addSeries} className="px-3 py-1 border-2 border-slate-200 rounded">Add Series</button>
            </div>
            <div className="space-y-3">
              {series.map((s, i) => (
                <div key={i} className="grid md:grid-cols-3 gap-2 items-center">
                  <input value={s.name} onChange={(e)=> updateSeries(i,'name', e.target.value)} className="px-3 py-2 border-2 border-slate-200 rounded" placeholder="Series name" />
                  <input value={s.values} onChange={(e)=> updateSeries(i,'values', e.target.value)} className="md:col-span-2 px-3 py-2 border-2 border-slate-200 rounded" placeholder="Values (comma-separated) e.g. 10, 20, 15" />
                  <div className="md:col-span-3">
                    <button onClick={()=> removeSeries(i)} className="text-red-600 text-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-bold text-slate-900 mb-1">Paste CSV (optional)</label>
            <textarea value={csv} onChange={(e)=> setCsv(e.target.value)} rows={5} className="w-full px-3 py-2 border-2 border-slate-200 rounded" placeholder={"Example:\n, Jan, Feb, Mar\nRevenue, 100000, 125000, 150000\nUsers, 1200, 1450, 1620"} />
            <div className="mt-2">
              <button onClick={parseCsv} className="px-3 py-2 border-2 border-slate-200 rounded">Parse CSV</button>
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-sm font-bold text-slate-900 mb-1">Or drag & drop a CSV file</label>
            <div
              onDragOver={(e)=>{ e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e)=>{
                e.preventDefault(); e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                if (!file.name.toLowerCase().endsWith('.csv')) { alert('Please drop a .csv file'); return; }
                const reader = new FileReader();
                reader.onload = () => setCsv(String(reader.result||''));
                reader.readAsText(file);
              }}
              className="border-2 border-dashed border-slate-300 rounded p-4 text-sm text-slate-600"
            >
              Drop CSV file here
            </div>
          </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">Series Colors (comma-separated hex)</label>
            <input value={seriesColors} onChange={(e)=> setSeriesColors(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" placeholder="#10B981, #3B82F6" />
          </div>
          <div className="px-4 py-3 border-t-2 border-slate-200 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border-2 border-slate-200 rounded">Cancel</button>
            <button onClick={save} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartPreview({
  type,
  categories,
  series,
  stacked,
  legendPosition = 'top-right',
  yFormat = 'auto',
  template = 'modern',
  seriesColors = [],
}: {
  type: 'bar'|'line'|'pie'|'doughnut',
  categories: string[],
  series: Array<{ name: string; values: number[] }>,
  stacked?: boolean,
  legendPosition?: 'top-right'|'bottom'|'right'|'left',
  yFormat?: 'auto'|'number'|'currency'|'percent',
  template?: string,
  seriesColors?: string[],
}) {
  const palette = seriesColors.length ? seriesColors : chartColorsForTemplate(template, series.length);
  const colors = palette.map(c => c.startsWith('#') ? c : `#${c}`);
  const max = Math.max(1, ...series.flatMap(s => s.values));
  const format = (v:number) => {
    try {
      if (yFormat === 'currency') return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
      if (yFormat === 'percent') return `${Math.round(v*100)}%`;
      return new Intl.NumberFormat('en-US').format(v);
    } catch { return String(v); }
  };
  const gridTicks = [0,0.25,0.5,0.75,1];
  return (
    <div className="border-2 border-slate-200 rounded p-3">
      <div style={{ position:'relative', height:220 }}>
        {type === 'bar' && (
          <div style={{ position:'absolute', inset:0 }}>
            <div style={{ position:'absolute', left:0, top:8, bottom:28, width:40, display:'flex', flexDirection:'column', justifyContent:'space-between', fontSize:10, color:'#475569', textAlign:'right', paddingRight:4 }}>
              {gridTicks.map((t,i)=> <div key={i}>{format(t*max)}</div>)}
            </div>
            <div style={{ position:'absolute', left:48, right: legendPosition==='right'?140:8, top:8, bottom:28, display:'flex', gap:12 }}>
              {categories.map((label, ci) => {
                const group = stacked ? (
                  <div style={{ width:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:2 }}>
                    {series.map((s,si)=>{
                      const v = s.values[ci]||0; const h = `${Math.max(4, Math.round((v/max)*100))}%`;
                      const inside = parseInt(h) > 18;
                      return <div key={si} style={{ background:colors[si], height:h, borderRadius:2, position:'relative' }} title={`${s.name}: ${v}`}>
                        {inside ? <span style={{ position:'absolute', bottom:2, left:4, fontSize:10, color:'#fff' }}>{format(v)}</span> : null}
                      </div>
                    })}
                  </div>
                ) : (
                  <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'flex-end', gap:6 }}>
                    {series.map((s,si)=>{
                      const v = s.values[ci]||0; const h = `${Math.max(4, Math.round((v/max)*100))}%`;
                      const inside = parseInt(h) > 18;
                      return <div key={si} style={{ flex:1, position:'relative' }} title={`${s.name}: ${v}`}>
                        <div style={{ background:colors[si], height:h, borderRadius:'4px 4px 0 0' }} />
                        {inside ? <span style={{ position:'absolute', bottom:'calc('+h+' + 2px)', left:2, fontSize:10, color:'#475569' }}>{format(v)}</span> : null}
                      </div>
                    })}
                  </div>
                );
                return (
                  <div key={ci} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end' }}>
                    <div style={{ width:'100%', height:'100%' }}>{group}</div>
                    <span style={{ fontSize:10, color:'#475569', marginTop:4 }}>{label}</span>
                  </div>
                );
              })}
            </div>
            {(legendPosition === 'top-right') && (
              <div style={{ position:'absolute', top:8, right:8, background:'#fff', border:'1px solid #e2e8f0', borderRadius:6, padding:'6px 8px', display:'flex', flexDirection:'column', gap:4, fontSize:11, color:'#475569' }}>
                {series.map((s,si)=> (
                  <div key={si} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ width:10, height:10, background:colors[si], display:'inline-block', borderRadius:2 }} />{s.name}
                  </div>
                ))}
              </div>
            )}
            {(legendPosition === 'right') && (
              <div style={{ position:'absolute', top:8, right:8, bottom:28, width:120, overflow:'auto', background:'#fff', border:'1px solid #e2e8f0', borderRadius:6, padding:'6px 8px', display:'flex', flexDirection:'column', gap:4, fontSize:11, color:'#475569' }}>
                {series.map((s,si)=> (
                  <div key={si} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ width:10, height:10, background:colors[si], display:'inline-block', borderRadius:2 }} />{s.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {type === 'line' && (
          <svg width="100%" height="220" viewBox="0 0 520 220">
            {gridTicks.map((t,i)=>{
              const y = 20 + t* (180);
              return <line key={i} x1={40} y1={y} x2={500} y2={y} stroke="#e2e8f0" strokeWidth={1} />
            })}
            {series.map((s,si)=>{
              const pts = s.values.map((v,idx)=>{
                const x = 40 + (idx*(460/Math.max(1,categories.length-1)));
                const y = 200 - ((v/max)*180);
                return `${x},${y}`;
              }).join(' ');
              return <polyline key={si} fill="none" stroke={colors[si]} strokeWidth={2} points={pts} />
            })}
            {series.map((s,si)=> s.values.map((v,idx)=>{
              const x = 40 + (idx*(460/Math.max(1,categories.length-1)));
              const y = 200 - ((v/max)*180);
              return <circle key={`${si}-${idx}`} cx={x} cy={y} r={3} fill={colors[si]} />
            }))}
            {categories.map((c,idx)=>{
              const x = 40 + (idx*(460/Math.max(1,categories.length-1)));
              return <text key={idx} x={x} y={215} textAnchor="middle" fontSize={10} fill="#475569">{c}</text>
            })}
          </svg>
        )}
        {(type === 'pie' || type==='doughnut') && (
          <svg width="100%" height="220" viewBox="0 0 520 220">
            {(() => {
              const first = series[0] || { name:'Series', values: [] };
              const total = first.values.reduce((a,b)=>a+b,0) || 1; let acc = 0;
              const cx = 260, cy=110, r=80, inner = type==='doughnut'? 45 : 0;
              const elems: any[] = [];
              first.values.forEach((v, i) => {
                const start = acc; const frac = v/total; acc += frac;
                const a0 = start*2*Math.PI, a1 = acc*2*Math.PI;
                const x0 = cx + r*Math.cos(a0), y0 = cy + r*Math.sin(a0);
                const x1 = cx + r*Math.cos(a1), y1 = cy + r*Math.sin(a1);
                const large = (a1 - a0) > Math.PI ? 1 : 0;
                const p = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
                elems.push(<path key={`slice-${i}`} d={p} fill={colors[i % colors.length]} />);
              });
              if (inner) elems.push(<circle key="hole" cx={cx} cy={cy} r={inner} fill="#fff" />);
              return elems;
            })()}
          </svg>
        )}
      </div>
      {(legendPosition === 'bottom') && (
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', fontSize:11, color:'#475569', marginTop:6 }}>
          {series.map((s,si)=> (
            <div key={si} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:10, height:10, background:colors[si], display:'inline-block', borderRadius:2 }} />{s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Robust CSV parser for quoted cells
function parseCsvString(input: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i+1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else { field += ch; }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { cur.push(field); field = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (field.length || cur.length) { cur.push(field); rows.push(cur); cur = []; field = ''; }
        // skip \r\n pairs
        if (ch === '\r' && input[i+1] === '\n') i++;
      } else { field += ch; }
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  return rows;
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
  for (let i=0;i<n;i++) out.push(base[i % base.length]);
  return out;
}
