import React, { useState, useMemo } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Palette } from 'lucide-react';

export const ColorConverter: React.FC = () => {
  const [hexInput, setHexInput] = useState('#10b981');

  // Convert hex to rgb
  const rgb = useMemo(() => {
    let clean = hexInput.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
      return null;
    }
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
  }, [hexInput]);

  // Convert rgb to hsl
  const hsl = useMemo(() => {
    if (!rgb) return null;
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }, [rgb]);

  // Convert rgb to hsv
  const hsv = useMemo(() => {
    if (!rgb) return null;
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  }, [rgb]);

  // Convert rgb to cmyk
  const cmyk = useMemo(() => {
    if (!rgb) return null;
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    const c = Math.round(((1 - r - k) / (1 - k)) * 100);
    const m = Math.round(((1 - g - k) / (1 - k)) * 100);
    const y = Math.round(((1 - b - k) / (1 - k)) * 100);

    return { c, m, y, k: Math.round(k * 100) };
  }, [rgb]);

  // Generate tints and shades
  const palette = useMemo(() => {
    if (!rgb) return [];
    const shades = [];
    for (let factor of [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8]) {
      let r, g, b;
      if (factor <= 1) {
        // shade (mix with black)
        r = Math.round(rgb.r * factor);
        g = Math.round(rgb.g * factor);
        b = Math.round(rgb.b * factor);
      } else {
        // tint (mix with white)
        const t = factor - 1;
        r = Math.round(rgb.r + (255 - rgb.r) * t);
        g = Math.round(rgb.g + (255 - rgb.g) * t);
        b = Math.round(rgb.b + (255 - rgb.b) * t);
      }
      const hex = '#' + [r, g, b].map((x) => Math.min(255, Math.max(0, x)).toString(16).padStart(2, '0')).join('');
      shades.push(hex);
    }
    return shades;
  }, [rgb]);

  const hexVal = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '';
  const hslString = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '';
  const hsvString = hsv ? `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` : '';
  const cmykString = cmyk ? `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` : '';

  return (
    <div className="space-y-6">
      {/* Visual Color Preview & Picker */}
      <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div
            className="w-28 h-28 rounded-2xl shadow-2xl border-2 border-slate-700/80 transition-transform group-hover:scale-105"
            style={{ backgroundColor: rgb ? hexVal : '#10b981' }}
          />
          <input
            type="color"
            value={rgb ? hexVal : '#10b981'}
            onChange={(e) => setHexInput(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            title="Click to open system color picker"
          />
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left w-full">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              HEX Color Value
            </label>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                placeholder="#10b981"
                className="w-48 px-3 py-2 bg-[#090d14] border border-slate-800 rounded-lg text-slate-100 font-mono text-sm uppercase focus:outline-none focus:border-emerald-500"
              />
              <CopyButton text={hexVal} label="Copy HEX" />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Click the color square or input any valid 3 or 6-digit hex code to sync.
          </p>
        </div>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'RGB', value: rgbString, code: `rgb(${rgb?.r}, ${rgb?.g}, ${rgb?.b})` },
          { label: 'HSL', value: hslString, code: hslString },
          { label: 'HSV', value: hsvString, code: hsvString },
          { label: 'CMYK', value: cmykString, code: cmykString },
          { label: 'CSS Variable', value: `--color-primary: ${hexVal};`, code: `--color-primary: ${hexVal};` },
          { label: 'RGBA (50% Opacity)', value: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)` : '', code: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)` : '' },
        ].map((item) => (
          <div
            key={item.label}
            className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
          >
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">{item.label}</span>
              <span className="font-mono text-xs text-slate-200 font-medium">{item.value || 'Invalid'}</span>
            </div>
            <CopyButton text={item.value} iconOnly />
          </div>
        ))}
      </div>

      {/* Palette Shades & Tints */}
      {palette.length > 0 && (
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Harmonious Tints & Shades</span>
          </div>
          <div className="grid grid-cols-9 gap-1.5 h-14 rounded-lg overflow-hidden border border-slate-800 p-1 bg-slate-950">
            {palette.map((shade, idx) => (
              <button
                key={idx}
                onClick={() => setHexInput(shade)}
                title={`Click to use ${shade}`}
                className="h-full rounded transition-transform hover:scale-105 relative group"
                style={{ backgroundColor: shade }}
              >
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-mono">
                  {shade}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
