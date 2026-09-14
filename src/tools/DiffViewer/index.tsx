import React, { useState, useMemo } from 'react';
import * as Diff from 'diff';
import { CopyButton } from '../../components/common/CopyButton';
import { GitCompare, Columns, Rows, Trash2, ArrowRightLeft } from 'lucide-react';

const SAMPLE_ORIGINAL = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const SAMPLE_MODIFIED = `function calculateTotal(items, discountRate = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = subtotal * discountRate;
  return Math.max(0, subtotal - discount);
}`;

export const DiffViewer: React.FC = () => {
  const [original, setOriginal] = useState(SAMPLE_ORIGINAL);
  const [modified, setModified] = useState(SAMPLE_MODIFIED);
  const [mode, setMode] = useState<'split' | 'unified'>('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  // Compute diffs
  const diffResult = useMemo(() => {
    return Diff.diffLines(original, modified, {
      ignoreWhitespace: ignoreWhitespace,
    });
  }, [original, modified, ignoreWhitespace]);

  // Statistics
  const stats = useMemo(() => {
    let additions = 0;
    let deletions = 0;
    diffResult.forEach((part) => {
      const count = part.count || 0;
      if (part.added) additions += count;
      if (part.removed) deletions += count;
    });
    return { additions, deletions };
  }, [diffResult]);

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mode Switch */}
          <div className="inline-flex p-1 bg-slate-800 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                mode === 'split' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Side-by-Side
            </button>
            <button
              onClick={() => setMode('unified')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                mode === 'unified' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Rows className="w-3.5 h-3.5" />
              Unified
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-800"
            />
            <span>Ignore Whitespace</span>
          </label>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-emerald-400 font-semibold">+{stats.additions} lines</span>
            <span className="text-rose-400 font-semibold">-{stats.deletions} lines</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Swap
          </button>
          <button
            onClick={() => {
              setOriginal('');
              setModified('');
            }}
            disabled={!original && !modified}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input Texts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-rose-400">Original Text (Before)</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={8}
            placeholder="Paste original text here..."
            className="w-full p-3.5 bg-[#090d14] border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-y"
            spellCheck={false}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-emerald-400">Modified Text (After)</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            rows={8}
            placeholder="Paste modified text here..."
            className="w-full p-3.5 bg-[#090d14] border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-y"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Rendered Diff View */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <GitCompare className="w-4 h-4 text-emerald-400" />
            <span>Computed Differences</span>
          </div>
          <CopyButton
            text={diffResult.map((p) => (p.added ? `+ ${p.value}` : p.removed ? `- ${p.value}` : `  ${p.value}`)).join('')}
            label="Copy Patch"
          />
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#090d14] overflow-x-auto p-4 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto">
          {diffResult.map((part, index) => {
            const lines = part.value.replace(/\n$/, '').split('\n');
            const isAdded = part.added;
            const isRemoved = part.removed;

            return lines.map((line, lIdx) => (
              <div
                key={`${index}-${lIdx}`}
                className={`flex items-start px-2 py-0.5 rounded ${
                  isAdded
                    ? 'bg-emerald-950/40 text-emerald-300 font-medium'
                    : isRemoved
                    ? 'bg-rose-950/40 text-rose-300 line-through opacity-80'
                    : 'text-slate-400'
                }`}
              >
                <span className="w-6 text-slate-600 select-none text-right mr-3 font-semibold">
                  {isAdded ? '+' : isRemoved ? '-' : ' '}
                </span>
                <span className="flex-1 whitespace-pre-wrap break-all">{line || ' '}</span>
              </div>
            ));
          })}
        </div>
      </div>
    </div>
  );
};
