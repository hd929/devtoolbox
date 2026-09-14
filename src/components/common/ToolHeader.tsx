import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { ToolItem } from '../../types';

interface ToolHeaderProps {
  tool: ToolItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  actions?: React.ReactNode;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  tool,
  isFavorite,
  onToggleFavorite,
  actions,
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">{tool.name}</h1>
          <button
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg transition-colors ${
              isFavorite
                ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            100% Client-side
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">{tool.description}</p>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
