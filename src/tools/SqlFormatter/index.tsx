import React, { useState } from 'react';
import { format as formatSql } from 'sql-formatter';
import { CopyButton } from '../../components/common/CopyButton';
import { useToast } from '../../context/ToastContext';
import { Minimize2, FileCode, Trash2, AlertCircle } from 'lucide-react';

const SAMPLE_SQL = `SELECT u.id, u.username, u.email, COUNT(o.id) as total_orders, SUM(o.total_amount) as lifetime_spend FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND u.created_at >= '2025-01-01' GROUP BY u.id, u.username, u.email HAVING COUNT(o.id) > 2 ORDER BY lifetime_spend DESC LIMIT 50;`;

export const SqlFormatter: React.FC = () => {
  const [sql, setSql] = useState(SAMPLE_SQL);
  const [dialect, setDialect] = useState<string>('sql');
  const [keywordCase, setKeywordCase] = useState<'upper' | 'lower' | 'preserve'>('upper');
  const [indent, setIndent] = useState<'2' | '4' | 'tab'>('2');
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  const handleFormat = () => {
    if (!sql.trim()) return;
    try {
      const formatted = formatSql(sql, {
        language: dialect as any,
        keywordCase: keywordCase,
        tabWidth: indent === 'tab' ? 2 : Number(indent),
        useTabs: indent === 'tab',
      });
      setSql(formatted);
      setError(null);
      showToast('SQL formatted', 'success');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleMinify = () => {
    if (!sql.trim()) return;
    try {
      // Clean comments and extra whitespace
      const minified = sql
        .replace(/--.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .trim();
      setSql(minified);
      setError(null);
      showToast('SQL minified', 'success');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Configuration Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleFormat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <FileCode className="w-3.5 h-3.5" />
            Format SQL
          </button>
          <button
            onClick={handleMinify}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            Minify
          </button>

          {/* Dialect Selector */}
          <div className="flex items-center gap-1.5 ml-2 text-xs text-slate-400">
            <span>Dialect:</span>
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="sql">Standard SQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="sqlite">SQLite</option>
              <option value="mariadb">MariaDB</option>
              <option value="transactsql">T-SQL (SQL Server)</option>
              <option value="bigquery">BigQuery</option>
            </select>
          </div>

          {/* Keyword Case */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Keywords:</span>
            <select
              value={keywordCase}
              onChange={(e) => setKeywordCase(e.target.value as any)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="upper">UPPERCASE</option>
              <option value="lower">lowercase</option>
              <option value="preserve">Preserve</option>
            </select>
          </div>

          {/* Indentation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Indent:</span>
            <select
              value={indent}
              onChange={(e) => setIndent(e.target.value as any)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={sql} label="Copy SQL" />
          <button
            onClick={() => setSql(SAMPLE_SQL)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
          >
            Sample
          </button>
          <button
            onClick={() => {
              setSql('');
              setError(null);
            }}
            disabled={!sql}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-950/40 border border-rose-800/70 rounded-xl text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>Error formatting SQL: {error}</span>
        </div>
      )}

      {/* Code Editor */}
      <div className="relative rounded-xl border border-slate-800 bg-[#090d14] overflow-hidden focus-within:border-emerald-500/60 transition-colors">
        <textarea
          value={sql}
          onChange={(e) => {
            setSql(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste or write your SQL query here..."
          className="w-full h-[480px] p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-emerald-500/30"
          spellCheck={false}
        />
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span>Lines: <strong className="text-slate-200">{sql ? sql.split('\n').length : 0}</strong></span>
            <span>Characters: <strong className="text-slate-200">{sql.length}</strong></span>
          </div>
          <span className="text-slate-500">Dialect: {dialect}</span>
        </div>
      </div>
    </div>
  );
};
