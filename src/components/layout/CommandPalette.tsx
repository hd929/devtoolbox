import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star } from 'lucide-react';
import { TOOLS } from '../../data/tools';
import { DynamicIcon } from '../common/DynamicIcon';
import { ToolItem } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  favorites: string[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  favorites,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tools based on query
  const filteredTools = TOOLS.filter((t) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredTools.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          onSelectTool(filteredTools[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredTools, onSelectTool, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools by name, keyword or tag..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool: ToolItem, index: number) => {
              const isSelected = index === selectedIndex;
              const isFav = favorites.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/15 text-white border border-emerald-500/30'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <DynamicIcon name={tool.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{tool.name}</span>
                        {isFav && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{tool.description}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded bg-slate-800 font-mono">
                    {tool.category}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No developer tool matches &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">ESC</kbd> Close</span>
          </div>
          <span className="text-emerald-400 font-medium">100% Client-Side</span>
        </div>
      </div>
    </div>
  );
};
