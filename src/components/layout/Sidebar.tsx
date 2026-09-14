import React from 'react';
import { CATEGORIES, TOOLS } from '../../data/tools';
import { DynamicIcon } from '../common/DynamicIcon';
import { Star, ShieldCheck, Terminal, X } from 'lucide-react';

interface SidebarProps {
  activeToolId: string;
  onSelectTool: (id: string) => void;
  favorites: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeToolId,
  onSelectTool,
  favorites,
  searchQuery,
  setSearchQuery,
  mobileOpen,
  onCloseMobile,
}) => {
  // Filtered tools
  const filteredTools = TOOLS.filter((tool) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const favoriteTools = TOOLS.filter((t) => favorites.includes(t.id));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-[#090d14] border-r border-slate-800 flex flex-col z-40 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                DevToolbox
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500">100% Client-Side Tools</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1 text-slate-400 hover:text-white rounded md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Filter */}
        <div className="p-3 border-b border-slate-800/80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools..."
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Tools Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Favorites Group (if any) */}
          {favoriteTools.length > 0 && !searchQuery && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-amber-400/90">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>Favorites</span>
              </div>
              <div className="space-y-0.5 pt-1">
                {favoriteTools.map((tool) => (
                  <button
                    key={`fav-${tool.id}`}
                    onClick={() => {
                      onSelectTool(tool.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      activeToolId === tool.id
                        ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <DynamicIcon
                      name={tool.icon}
                      className={`w-3.5 h-3.5 ${
                        activeToolId === tool.id ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Tools */}
          {CATEGORIES.map((cat) => {
            const catTools = filteredTools.filter((t) => t.category === cat.id);
            if (catTools.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-1">
                <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {cat.label}
                </div>
                <div className="space-y-0.5 pt-1">
                  {catTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onSelectTool(tool.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                        activeToolId === tool.id
                          ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <DynamicIcon
                          name={tool.icon}
                          className={`w-3.5 h-3.5 shrink-0 ${
                            activeToolId === tool.id ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{tool.name}</span>
                      </div>
                      {favorites.includes(tool.id) && (
                        <Star className="w-3 h-3 text-amber-400/80 fill-amber-400/80 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredTools.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-6">No tools match your query.</p>
          )}
        </div>

        {/* Security & Client-side guarantee footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Data Leakage</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Runs 100% locally in your browser. Tokens and files are never transmitted anywhere.
          </p>
        </div>
      </aside>
    </>
  );
};
