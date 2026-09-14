import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { Upload, Download, Sliders, Sparkles } from 'lucide-react';

interface ImageMetadata {
  file: File;
  name: string;
  size: number;
  width: number;
  height: number;
  dataUrl: string;
}

interface CompressedResult {
  dataUrl: string;
  size: number;
  width: number;
  height: number;
  savingsPercent: number;
}

export const ImageCompressor: React.FC = () => {
  const [original, setOriginal] = useState<ImageMetadata | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressed, setCompressed] = useState<CompressedResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOriginal({
          file,
          name: file.name,
          size: file.size,
          width: img.naturalWidth,
          height: img.naturalHeight,
          dataUrl,
        });
        setMaxWidth(img.naturalWidth);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const processCompression = () => {
    if (!original) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      let targetW = img.naturalWidth;
      let targetH = img.naturalHeight;

      if (maxWidth && targetW > maxWidth) {
        targetH = Math.round((targetH * maxWidth) / targetW);
        targetW = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // If jpeg, fill white background for transparent images
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          const compressedDataUrl = canvas.toDataURL(outputFormat, quality / 100);
          const compressedSize = blob.size;
          const savings = Math.max(0, Math.round(((original.size - compressedSize) / original.size) * 100));

          setCompressed({
            dataUrl: compressedDataUrl,
            size: compressedSize,
            width: targetW,
            height: targetH,
            savingsPercent: savings,
          });
          setIsProcessing(false);
        },
        outputFormat,
        quality / 100
      );
    };
    img.src = original.dataUrl;
  };

  useEffect(() => {
    if (original) {
      processCompression();
    }
  }, [original, quality, outputFormat, maxWidth]);

  const handleDownload = () => {
    if (!compressed || !original) return;
    const a = document.createElement('a');
    a.href = compressed.dataUrl;
    const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/jpeg' ? 'jpg' : 'png';
    const baseName = original.name.substring(0, original.name.lastIndexOf('.')) || original.name;
    a.download = `${baseName}-compressed.${ext}`;
    a.click();
    showToast('Compressed image downloaded', 'success');
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!original ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500/60 rounded-2xl p-12 text-center bg-slate-900/40 hover:bg-slate-900/60 transition-all cursor-pointer space-y-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = '';
            }}
            accept="image/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-200">
              Drag and drop your image here, or click to browse
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PNG, JPEG, WebP, SVG. 100% processed on your device via HTML5 Canvas.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Panel */}
          <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Compression Settings</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
                >
                  Change Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                    e.target.value = '';
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={handleDownload}
                  disabled={!compressed}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Compressed
                </button>
              </div>
            </div>

            {/* Sliders and Format Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800 text-xs">
              {/* Quality */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Quality:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Output format */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Output Format:</span>
                </div>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="image/webp">WebP (Best size & quality)</option>
                  <option value="image/jpeg">JPEG (Universal)</option>
                  <option value="image/png">PNG (Lossless / Transparency)</option>
                </select>
              </div>

              {/* Max Width */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Max Width (px):</span>
                  <span className="font-mono text-slate-300">{maxWidth} px</span>
                </div>
                <input
                  type="number"
                  min="100"
                  max={original.width}
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Math.max(50, Number(e.target.value)))}
                  className="w-full px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">Original Image</span>
                <span className="font-mono text-slate-300">{formatBytes(original.size)}</span>
              </div>

              <div className="h-72 bg-slate-950/80 rounded-lg border border-slate-800/80 flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={original.dataUrl}
                  alt="Original"
                  className="max-h-full max-w-full object-contain rounded"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Dimensions: {original.width} × {original.height} px</span>
                <span>Type: {original.file.type}</span>
              </div>
            </div>

            {/* Compressed Card */}
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3 relative">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Compressed Preview
                </span>
                {compressed && (
                  <span className="font-mono text-emerald-400 font-bold">
                    {formatBytes(compressed.size)}
                  </span>
                )}
              </div>

              <div className="h-72 bg-slate-950/80 rounded-lg border border-slate-800/80 flex items-center justify-center p-2 overflow-hidden relative">
                {isProcessing ? (
                  <span className="text-xs text-slate-400">Compressing...</span>
                ) : compressed ? (
                  <img
                    src={compressed.dataUrl}
                    alt="Compressed"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                ) : null}

                {/* Savings pill badge */}
                {compressed && compressed.savingsPercent > 0 && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full shadow-lg">
                    -{compressed.savingsPercent}% Saved
                  </div>
                )}
              </div>

              {compressed && (
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Dimensions: {compressed.width} × {compressed.height} px</span>
                  <span>Format: {outputFormat.replace('image/', '').toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
