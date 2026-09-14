import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copy',
  className = '',
  iconOnly = false,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      title={label}
      className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
        copied
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed'
      } ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {!iconOnly && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  );
};
