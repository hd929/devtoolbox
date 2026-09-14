import React, { useState, useEffect, useCallback } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { RefreshCw, Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const UuidGenerator: React.FC = () => {
  const [version, setVersion] = useState<'v4' | 'v1'>('v4');
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [wrapBraces, setWrapBraces] = useState(false);
  const [wrapQuotes, setWrapQuotes] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const { showToast } = useToast();

  const generateSingleV4 = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateSingleV1 = (): string => {
    // Pseudo v1 timestamp based
    const now = Date.now();
    const timeHex = now.toString(16).padStart(12, '0');
    const part1 = timeHex.slice(-8);
    const part2 = timeHex.slice(-12, -8).padStart(4, '0');
    const part3 = '1' + Math.floor(Math.random() * 0xfff).toString(16).padStart(3, '0');
    const part4 = ((Math.floor(Math.random() * 0x3fff) | 0x8000)).toString(16);
    const part5 = Math.floor(Math.random() * 0xffffffffffff).toString(16).padStart(12, '0');
    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
  };

  const generateUuids = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = version === 'v4' ? generateSingleV4() : generateSingleV1();
      if (!hyphens) {
        id = id.replace(/-/g, '');
      }
      if (uppercase) {
        id = id.toUpperCase();
      } else {
        id = id.toLowerCase();
      }
      if (wrapBraces) {
        id = `{${id}}`;
      }
      if (wrapQuotes) {
        id = `"${id}"`;
      }
      list.push(id);
    }
    setUuids(list);
  }, [count, version, uppercase, hyphens, wrapBraces, wrapQuotes]);

  useEffect(() => {
    generateUuids();
  }, [generateUuids]);

  const allUuidsText = uuids.join('\n');

  const handleDownload = () => {
    const blob = new Blob([allUuidsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${version}-${count}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${count} UUIDs`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Configuration Controls */}
      <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Version & Count */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Version:</span>
              <div className="inline-flex p-1 bg-slate-800 rounded-lg border border-slate-700/60 text-xs">
                <button
                  onClick={() => setVersion('v4')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    version === 'v4' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  v4 (Random)
                </button>
                <button
                  onClick={() => setVersion('v1')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    version === 'v1' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  v1 (Time-based)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Quantity:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="w-20 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500 text-center"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateUuids}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download TXT
            </button>
            <CopyButton text={allUuidsText} label="Copy All" />
          </div>
        </div>

        {/* Formatting Toggles */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
            />
            <span>Include Hyphens (-)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
            />
            <span>Uppercase (A-F)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={wrapBraces}
              onChange={(e) => setWrapBraces(e.target.checked)}
              className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
            />
            <span>Wrap in Braces {'{...}'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={wrapQuotes}
              onChange={(e) => setWrapQuotes(e.target.checked)}
              className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
            />
            <span>Wrap in Quotes &quot;...&quot;</span>
          </label>
        </div>
      </div>

      {/* UUIDs List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            Generated UUIDs ({uuids.length})
          </span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#090d14] divide-y divide-slate-850 max-h-[500px] overflow-y-auto">
          {uuids.map((id, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-600 w-6 text-right">
                  {index + 1}.
                </span>
                <span className="font-mono text-xs text-slate-200 select-all group-hover:text-emerald-300 transition-colors">
                  {id}
                </span>
              </div>
              <CopyButton text={id} iconOnly />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
