"use client";

import { useState } from 'react';

type ChartData = { type: 'bar'|'line'|'pie'|'doughnut', categories: string[], series: Array<{ name: string; values: number[] }> };

export default function ChartEditor({ initial, onSave, onClose }: { initial?: ChartData; onSave: (data: ChartData) => void; onClose: () => void; }) {
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
  const [legendPosition, setLegendPosition] = useState<'top-right'|'bottom'|'right'>(initial?.legendPosition || 'top-right');
  const [yFormat, setYFormat] = useState<'auto'|'number'|'currency'|'percent'>(initial?.yFormat || 'auto');
  const [csv, setCsv] = useState<string>('');

  const addSeries = () => setSeries(arr => [...arr, { name: `Series ${arr.length+1}`, values: '' }]);
  const removeSeries = (i: number) => setSeries(arr => arr.filter((_, idx) => idx !== i));
  const updateSeries = (i: number, key: 'name'|'values', value: string) => setSeries(arr => arr.map((s, idx) => idx === i ? { ...s, [key]: value } : s));

  const save = () => {
    const cats = categories.split(',').map(s => s.trim()).filter(Boolean);
    const ser = series.map(s => ({ name: s.name.trim() || 'Series', values: s.values.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v)) }));
    const colors = seriesColors.split(',').map(s => s.trim()).filter(Boolean);
    onSave({ type, categories: cats, series: ser, stacked, showLegend, xLabel: xLabel || undefined, yLabel: yLabel || undefined, seriesColors: colors.length ? colors : undefined, legendPosition, yFormat });
  };

  const parseCsv = () => {
    try {
      const lines = csv.trim().split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return;
      const header = lines[0].split(',').map(s => s.trim());
      const cats = header.slice(1);
      const ser: Array<{ name: string; values: string }> = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
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
