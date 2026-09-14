import React, { useState, useMemo } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { ArrowRightLeft, Trash2, Plus, Globe } from 'lucide-react';

const SAMPLE_URL = 'https://api.ajitana.io.vn/v1/search?query=react+developer+tools&limit=25&category=developer&active=true#section-results';

export const UrlEncoder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'encode' | 'parser'>('encode');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component');
  const [input, setInput] = useState(SAMPLE_URL);
  const [error, setError] = useState<string | null>(null);

  // For Query Parser tab
  const [parseUrl, setParseUrl] = useState(SAMPLE_URL);

  const output = useMemo(() => {
    if (!input) return '';
    try {
      setError(null);
      if (mode === 'encode') {
        return encodeType === 'component' ? encodeURIComponent(input) : encodeURI(input);
      } else {
        return encodeType === 'component' ? decodeURIComponent(input) : decodeURI(input);
      }
    } catch (e: unknown) {
      setError((e as Error).message);
      return '';
    }
  }, [input, mode, encodeType]);

  // Parse breakdown
  const parsedUrl = useMemo(() => {
    try {
      const url = new URL(parseUrl);
      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      return {
        valid: true,
        protocol: url.protocol,
        host: url.host,
        pathname: url.pathname,
        hash: url.hash,
        params,
      };
    } catch {
      return { valid: false };
    }
  }, [parseUrl]);

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
  };

  const updateParam = (index: number, newKey: string, newValue: string) => {
    try {
      const url = new URL(parseUrl);
      const keys: string[] = [];
      url.searchParams.forEach((_, k) => keys.push(k));
      
      const newUrl = new URL(url.origin + url.pathname + url.hash);
      parsedUrl.params?.forEach((p, idx) => {
        if (idx === index) {
          if (newKey) newUrl.searchParams.append(newKey, newValue);
        } else {
          newUrl.searchParams.append(p.key, p.value);
        }
      });
      setParseUrl(newUrl.toString());
    } catch {
      // ignore
    }
  };

  const deleteParam = (index: number) => {
    try {
      const url = new URL(parseUrl);
      const newUrl = new URL(url.origin + url.pathname + url.hash);
      parsedUrl.params?.forEach((p, idx) => {
        if (idx !== index) {
          newUrl.searchParams.append(p.key, p.value);
        }
      });
      setParseUrl(newUrl.toString());
    } catch {
      // ignore
    }
  };

  const addParam = () => {
    try {
      const url = new URL(parseUrl);
      url.searchParams.append('new_key', 'value');
      setParseUrl(url.toString());
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('encode')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'encode'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Encoder / Decoder
        </button>
        <button
          onClick={() => setActiveTab('parser')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'parser'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          URL Breakdown & Params Editor
        </button>
      </div>

      {activeTab === 'encode' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex p-1 bg-slate-800 rounded-lg border border-slate-700/60">
                <button
                  onClick={() => setMode('encode')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    mode === 'encode'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Encode
                </button>
                <button
                  onClick={() => setMode('decode')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    mode === 'decode'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Decode
                </button>
              </div>

              <div className="flex items-center gap-2 ml-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="encodeType"
                    checked={encodeType === 'component'}
                    onChange={() => setEncodeType('component')}
                    className="text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Component (encodeURIComponent)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer ml-2">
                  <input
                    type="radio"
                    name="encodeType"
                    checked={encodeType === 'full'}
                    onChange={() => setEncodeType('full')}
                    className="text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Full URI (encodeURI)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                disabled={!output}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/60 disabled:opacity-40 transition-colors"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Swap
              </button>
              <button
                onClick={() => setInput('')}
                disabled={!input}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400">
                  {mode === 'encode' ? 'Raw URL or String' : 'Encoded URL'}
                </label>
                <span className="text-[11px] text-slate-500">{input.length} chars</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={10}
                placeholder="Enter URL to encode/decode..."
                className="w-full p-3.5 rounded-xl border border-slate-800 bg-[#090d14] text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500/60 resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400">
                  {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">{output.length} chars</span>
                  <CopyButton text={output} />
                </div>
              </div>
              <textarea
                value={error ? error : output}
                readOnly
                rows={10}
                className={`w-full p-3.5 rounded-xl border font-mono text-xs resize-y focus:outline-none leading-relaxed ${
                  error
                    ? 'bg-rose-950/20 border-rose-900/60 text-rose-300'
                    : 'bg-[#090d14] border-slate-800 text-emerald-300'
                }`}
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'parser' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">URL to parse & edit</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={parseUrl}
                  onChange={(e) => setParseUrl(e.target.value)}
                  placeholder="https://example.com/path?foo=bar"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#090d14] border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <CopyButton text={parseUrl} label="Copy Full URL" />
            </div>
          </div>

          {parsedUrl.valid ? (
            <div className="space-y-4">
              {/* Components preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">Protocol</span>
                  <span className="font-mono text-emerald-400 font-semibold">{parsedUrl.protocol}</span>
                </div>
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">Host</span>
                  <span className="font-mono text-slate-200 font-semibold truncate block">{parsedUrl.host}</span>
                </div>
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">Path</span>
                  <span className="font-mono text-slate-200 truncate block">{parsedUrl.pathname}</span>
                </div>
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">Hash / Fragment</span>
                  <span className="font-mono text-slate-400">{parsedUrl.hash || '(none)'}</span>
                </div>
              </div>

              {/* Params Table */}
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Query Parameters ({parsedUrl.params?.length || 0})
                  </span>
                  <button
                    onClick={addParam}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Parameter
                  </button>
                </div>

                {parsedUrl.params && parsedUrl.params.length > 0 ? (
                  <div className="space-y-2">
                    {parsedUrl.params.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={p.key}
                          onChange={(e) => updateParam(idx, e.target.value, p.value)}
                          placeholder="Key"
                          className="w-1/3 px-3 py-1.5 bg-[#090d14] border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-slate-600">=</span>
                        <input
                          type="text"
                          value={p.value}
                          onChange={(e) => updateParam(idx, p.key, e.target.value)}
                          placeholder="Value"
                          className="flex-1 px-3 py-1.5 bg-[#090d14] border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => deleteParam(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete parameter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-3 text-center">No query parameters in this URL.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
              Enter a valid absolute URL (with http:// or https://) to inspect parameters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
