import React, { useState, useMemo } from 'react';
import { Marked } from 'marked';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import { CopyButton } from '../../components/common/CopyButton';
import { useToast } from '../../context/ToastContext';
import { Download, Columns, Eye, Edit3, Trash2 } from 'lucide-react';

const SAMPLE_MD = `# 🚀 Developer Toolbox

An all-in-one developer toolbox running **100% client-side** in your browser.

## Key Features
- [x] **Zero Backend**: All computations run in your browser.
- [x] **Secure & Private**: Tokens, keys, and code never leave your machine.
- [x] **Blazing Fast**: Instant previews and conversions.

### Sample Code Block
\`\`\`typescript
interface DeveloperTool {
  id: string;
  name: string;
  category: 'formatters' | 'security' | 'converters' | 'text-media';
}

const isSecure = (): boolean => true;
\`\`\`

### Data Comparison Table
| Tool | Processing | Server Calls |
| :--- | :--- | :--- |
| JWT Decoder | Client-side | 0 |
| Hash Generator | Client-side | 0 |
| Image Compressor | Canvas API | 0 |

> "Simplicity is the soul of efficiency." – Austin Freeman

Enjoy building amazing web applications!
`;

export const MarkdownPreview: React.FC = () => {
  const [markdown, setMarkdown] = useState(SAMPLE_MD);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const { showToast } = useToast();

  const markedInstance = useMemo(() => {
    return new Marked({
      gfm: true,
      breaks: true,
      renderer: {
        code({ text, lang }: { text: string; lang?: string }) {
          const validLang = lang && hljs.getLanguage(lang) ? lang : '';
          const highlighted = validLang
            ? hljs.highlight(text, { language: validLang }).value
            : hljs.highlightAuto(text).value;
          const displayLang = lang || 'code';

          return `<div class="code-block my-4 rounded-xl border border-slate-700/80 bg-[#090d14] overflow-hidden shadow-lg">
            <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span class="text-emerald-400 font-semibold uppercase tracking-wider">${displayLang}</span>
              <span class="text-slate-500">syntax highlighted</span>
            </div>
            <pre class="hljs p-4 overflow-x-auto text-xs leading-relaxed font-mono m-0 bg-transparent"><code>${highlighted}</code></pre>
          </div>`;
        },
      },
    });
  }, []);

  const renderedHtml = useMemo(() => {
    try {
      const rawHtml = markedInstance.parse(markdown) as string;
      return DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ['target', 'class'],
        ADD_TAGS: ['input'],
      });
    } catch {
      return '<p class="text-rose-400">Failed to render markdown</p>';
    }
  }, [markdown, markedInstance]);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded markdown file', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
        {/* View Mode Controls */}
        <div className="inline-flex p-1 bg-slate-800 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'split' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Split View
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'edit' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Editor Only
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'preview' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Only
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <CopyButton text={renderedHtml} label="Copy HTML" />
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download MD
          </button>
          <button
            onClick={() => setMarkdown('')}
            disabled={!markdown}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-40"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Markdown Source Area */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div className={`space-y-2 ${viewMode === 'edit' ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Markdown Source</span>
              <span>{markdown.length} characters</span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type Markdown content here..."
              className="w-full h-[540px] p-4 bg-[#090d14] border border-slate-800 rounded-xl text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:border-emerald-500/60"
              spellCheck={false}
            />
          </div>
        )}

        {/* Live Preview Area */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`space-y-2 ${viewMode === 'preview' ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Rendered Preview</span>
              <span className="text-emerald-400">GFM Compliant</span>
            </div>
            <div
              className="w-full h-[540px] p-6 bg-[#090d14] border border-slate-800 rounded-xl overflow-y-auto markdown-preview-content leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
