import React, { useState, useMemo } from 'react';
import CryptoJS from 'crypto-js';
import { CopyButton } from '../../components/common/CopyButton';
import { Shield, Key, Upload, FileCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const HashGenerator: React.FC = () => {
  const [input, setInput] = useState('Hello, World!');
  const [secretKey, setSecretKey] = useState('');
  const [useHmac, setUseHmac] = useState(false);
  const [uppercase, setUppercase] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);

  const { showToast } = useToast();

  const hashes = useMemo(() => {
    if (!input) return [];

    let md5Val = '';
    let sha1Val = '';
    let sha256Val = '';
    let sha512Val = '';
    let sha224Val = '';
    let sha384Val = '';

    if (useHmac) {
      const key = secretKey || '';
      md5Val = CryptoJS.HmacMD5(input, key).toString();
      sha1Val = CryptoJS.HmacSHA1(input, key).toString();
      sha256Val = CryptoJS.HmacSHA256(input, key).toString();
      sha512Val = CryptoJS.HmacSHA512(input, key).toString();
      sha224Val = CryptoJS.HmacSHA224(input, key).toString();
      sha384Val = CryptoJS.HmacSHA384(input, key).toString();
    } else {
      md5Val = CryptoJS.MD5(input).toString();
      sha1Val = CryptoJS.SHA1(input).toString();
      sha256Val = CryptoJS.SHA256(input).toString();
      sha512Val = CryptoJS.SHA512(input).toString();
      sha224Val = CryptoJS.SHA224(input).toString();
      sha384Val = CryptoJS.SHA384(input).toString();
    }

    const format = (v: string) => (uppercase ? v.toUpperCase() : v.toLowerCase());

    return [
      { name: 'MD5', bit: '128-bit', hash: format(md5Val) },
      { name: 'SHA-1', bit: '160-bit', hash: format(sha1Val) },
      { name: 'SHA-256', bit: '256-bit', hash: format(sha256Val) },
      { name: 'SHA-512', bit: '512-bit', hash: format(sha512Val) },
      { name: 'SHA-224', bit: '224-bit', hash: format(sha224Val) },
      { name: 'SHA-384', bit: '384-bit', hash: format(sha384Val) },
    ];
  }, [input, secretKey, useHmac, uppercase]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer as any);
      const hash256 = CryptoJS.SHA256(wordArray).toString();
      setInput(`Computed Checksum for ${file.name} (SHA-256: ${hash256})`);
      showToast(`Computed checksum for ${file.name}`, 'success');
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const copyAllFormatted = () => {
    const text = hashes.map((h) => `${h.name}: ${h.hash}`).join('\n');
    navigator.clipboard.writeText(text);
    showToast('All hashes copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400">
              Input String / Text
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
                />
                <span>Uppercase Output</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useHmac}
                  onChange={(e) => setUseHmac(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
                />
                <span className="flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-400" /> HMAC Mode
                </span>
              </label>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setFileName(null);
            }}
            rows={3}
            placeholder="Type or paste string to hash..."
            className="w-full p-3 bg-[#090d14] border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500/60 leading-relaxed"
          />
        </div>

        {/* HMAC Secret Key Field */}
        {useHmac && (
          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-1.5">
            <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              HMAC Secret Key
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret key for HMAC authentication..."
              className="w-full px-3 py-2 bg-[#090d14] border border-amber-900/50 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        {/* File hashing info */}
        {fileName && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg">
            <FileCheck className="w-4 h-4" />
            <span>
              Hashing file: <strong>{fileName}</strong> (
              {fileSize ? (fileSize / 1024).toFixed(1) : 0} KB)
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer border border-slate-700/60 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Hash a File</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={copyAllFormatted}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition-colors"
          >
            Copy All Hashes
          </button>
        </div>
      </div>

      {/* Generated Hash Cards */}
      <div className="space-y-3">
        {hashes.map((item) => (
          <div
            key={item.name}
            className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">{item.name}</span>
                  <span className="text-[10px] text-slate-500 px-1.5 py-0.2 rounded bg-slate-800">
                    {item.bit}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {useHmac ? 'HMAC digest' : 'Cryptographic hash'}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="font-mono text-xs text-emerald-300 bg-[#090d14] px-3 py-2 rounded-lg border border-slate-800/80 break-all select-all">
                {item.hash}
              </div>
            </div>

            <div className="shrink-0">
              <CopyButton text={item.hash} iconOnly />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
