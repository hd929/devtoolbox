import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { useToast } from '../../context/ToastContext';
import { Download, Upload, Trash2, ArrowUpDown, Minimize2, FileCode, CheckCircle2, AlertTriangle } from 'lucide-react';

const SAMPLE_JSON = `{
  "app": "Developer Toolbox",
  "version": "1.0.0",
  "features": [
    "JSON Formatter",
    "JWT Decoder",
    "Base64 Converter",
    "100% Client-Side"
  ],
  "settings": {
    "theme": "dark",
    "offline_ready": true,
    "security": {
      "server_requests": 0,
      "privacy": "maximum"
    }
  },
  "rating": 5
}`;

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [indent, setIndent] = useState<'2' | '4' | 'tab'>('2');
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const getIndentSpace = () => {
    if (indent === 'tab') return '\t';
    return Number(indent);
  };

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, getIndentSpace()));
      setError(null);
      showToast('JSON formatted successfully', 'success');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
      showToast('JSON minified', 'success');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleSortKeys = () => {
    if (!input.trim()) return;
    try {
      const sortObject = (obj: any): any => {
        if (obj !== null && typeof obj === 'object') {
          if (Array.isArray(obj)) {
            return obj.map(sortObject);
          }
          return Object.keys(obj)
            .sort()
            .reduce((acc: any, key) => {
              acc[key] = sortObject(obj[key]);
              return acc;
            }, {});
        }
        return obj;
      };

      const parsed = JSON.parse(input);
      const sorted = sortObject(parsed);
      setInput(JSON.stringify(sorted, null, getIndentSpace()));
      setError(null);
      showToast('Keys sorted alphabetically', 'success');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      setError(null);
      showToast(`Loaded ${file.name}`, 'info');
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  const handleDownload = () => {
    if (!input.trim()) return;
    const blob = new Blob([input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded JSON file', 'success');
  };

  const lineCount = input ? input.split('\n').length : 0;
  const byteCount = new Blob([input]).size;

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/70 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            Format
          </button>
          <button
            onClick={handleMinify}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            Minify
          </button>
          <button
            onClick={handleSortKeys}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort Keys
          </button>

          {/* Indent Selector */}
          <div className="flex items-center gap-1 ml-2 text-xs text-slate-400">
            <span>Indent:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(e.target.value as any)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/60 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
            <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={handleDownload}
            disabled={!input.trim()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/60 disabled:opacity-40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <CopyButton text={input} label="Copy JSON" />
          <button
            onClick={() => {
              setInput('');
              setError(null);
            }}
            disabled={!input}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-40"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-rose-200">Invalid JSON Syntax:</span>
            {error}
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className="relative rounded-xl border border-slate-800 bg-[#090d14] overflow-hidden focus-within:border-emerald-500/60 transition-colors">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste or type JSON here..."
          className="w-full h-[520px] p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-emerald-500/30"
          spellCheck={false}
        />
        
        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span>Lines: <strong className="text-slate-200">{lineCount}</strong></span>
            <span>Size: <strong className="text-slate-200">{(byteCount / 1024).toFixed(2)} KB</strong></span>
            <span>Characters: <strong className="text-slate-200">{input.length}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            {error ? (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Error
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Valid
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
