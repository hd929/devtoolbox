import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { useToast } from '../../context/ToastContext';
import { ArrowRightLeft, Upload, Trash2, Download } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'preview'>('text');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState(false);
  const [input, setInput] = useState('Hello World! Xin chào thế giới! 🚀');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // File to base64 states
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);

  // Preview base64 image state
  const [previewInput, setPreviewInput] = useState('');

  const { showToast } = useToast();

  // UTF-8 safe encode
  const encodeBase64 = (str: string, safe: boolean) => {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let b64 = btoa(binary);
    if (safe) {
      b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return b64;
  };

  // UTF-8 safe decode
  const decodeBase64 = (str: string) => {
    let clean = str.trim();
    // Revert URL safe if needed
    clean = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4) {
      clean += '=';
    }
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  };

  const processText = (text: string, currentMode: 'encode' | 'decode', isUrlSafe: boolean) => {
    if (!text) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      if (currentMode === 'encode') {
        setOutput(encodeBase64(text, isUrlSafe));
      } else {
        setOutput(decodeBase64(text));
      }
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid Base64 sequence');
      setOutput('');
    }
  };

  // Trigger processing on text change
  const handleInputChange = (val: string) => {
    setInput(val);
    processText(val, mode, urlSafe);
  };

  const handleModeToggle = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    processText(input, newMode, urlSafe);
  };

  const handleUrlSafeToggle = () => {
    const next = !urlSafe;
    setUrlSafe(next);
    processText(input, mode, next);
  };

  const handleSwap = () => {
    const temp = output;
    setInput(temp);
    const nextMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(nextMode);
    processText(temp, nextMode, urlSafe);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInfo({ name: file.name, size: file.size, type: file.type || 'application/octet-stream' });
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
      showToast('File converted to Base64', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => {
            setActiveTab('text');
            processText(input, mode, urlSafe);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'text'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Text Converter
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'file'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          File to Base64
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'preview'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Base64 Image Preview
        </button>
      </div>

      {/* TAB 1: TEXT CONVERTER */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="inline-flex p-1 bg-slate-800 rounded-lg border border-slate-700/60">
                <button
                  onClick={() => handleModeToggle('encode')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    mode === 'encode'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Encode
                </button>
                <button
                  onClick={() => handleModeToggle('decode')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    mode === 'decode'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Decode
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 ml-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={urlSafe}
                  onChange={handleUrlSafeToggle}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 bg-slate-800"
                />
                <span>URL-Safe (- / _)</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                disabled={!output}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/60 disabled:opacity-40 transition-colors"
                title="Swap Input and Output"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Swap
              </button>
              <button
                onClick={() => {
                  setInput('');
                  setOutput('');
                  setError(null);
                }}
                disabled={!input && !output}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-40"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400">
                  {mode === 'encode' ? 'Plain Text (UTF-8)' : 'Base64 Input'}
                </label>
                <span className="text-[11px] text-slate-500">{input.length} chars</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter base64 to decode...'}
                className="w-full h-80 p-4 rounded-xl border border-slate-800 bg-[#090d14] text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500/60 resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400">
                  {mode === 'encode' ? 'Base64 Output' : 'Decoded Plain Text'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">{output.length} chars</span>
                  <CopyButton text={output} />
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={error ? error : output}
                  readOnly
                  placeholder="Output will appear here..."
                  className={`w-full h-80 p-4 rounded-xl border font-mono text-xs resize-none focus:outline-none leading-relaxed ${
                    error
                      ? 'bg-rose-950/20 border-rose-900/60 text-rose-300'
                      : 'bg-[#090d14] border-slate-800 text-emerald-300'
                  }`}
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FILE TO BASE64 */}
      {activeTab === 'file' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500/60 rounded-xl p-8 text-center bg-slate-900/40 transition-colors">
            <input
              type="file"
              id="file-b64-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-b64-upload"
              className="flex flex-col items-center justify-center cursor-pointer space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Click to select any file or image
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  The file will be read entirely in your browser into a Base64 Data URL.
                </p>
              </div>
            </label>
          </div>

          {fileInfo && fileBase64 && (
            <div className="space-y-3 p-4 bg-slate-900/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-200">{fileInfo.name}</span>
                  <span className="text-slate-400">({(fileInfo.size / 1024).toFixed(1)} KB)</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
                    {fileInfo.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={fileBase64} label="Copy Data URI" />
                  <CopyButton
                    text={fileBase64.split(',')[1] || fileBase64}
                    label="Copy Raw Base64"
                  />
                </div>
              </div>

              <textarea
                value={fileBase64}
                readOnly
                rows={6}
                className="w-full p-3 bg-[#090d14] border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px] focus:outline-none resize-none leading-relaxed"
              />
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BASE64 IMAGE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              Paste Base64 String or Data URL (data:image/...;base64,...)
            </label>
            <textarea
              value={previewInput}
              onChange={(e) => setPreviewInput(e.target.value)}
              placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              rows={3}
              className="w-full p-3 bg-[#090d14] border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500/60 leading-relaxed"
            />
          </div>

          {previewInput.trim() && (
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col items-center justify-center space-y-4">
              <div className="max-w-md max-h-96 overflow-hidden rounded-lg border border-slate-700 bg-slate-950 p-2 flex items-center justify-center">
                <img
                  src={
                    previewInput.startsWith('data:image')
                      ? previewInput
                      : `data:image/png;base64,${previewInput}`
                  }
                  alt="Base64 Preview"
                  className="max-h-80 object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <a
                href={
                  previewInput.startsWith('data:image')
                    ? previewInput
                    : `data:image/png;base64,${previewInput}`
                }
                download="base64-image.png"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Image
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
