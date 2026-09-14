import React, { useState, useMemo } from 'react';
import cronstrue from 'cronstrue';
import { CopyButton } from '../../components/common/CopyButton';
import { Calendar, AlertTriangle, Sparkles } from 'lucide-react';

const PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every 5 minutes', expr: '*/5 * * * *' },
  { label: 'Every 15 minutes', expr: '*/15 * * * *' },
  { label: 'Every hour at :00', expr: '0 * * * *' },
  { label: 'Daily at midnight (00:00)', expr: '0 0 * * *' },
  { label: 'Every day at 9:00 AM', expr: '0 9 * * *' },
  { label: 'Every weekday (Mon-Fri) at 9:00 AM', expr: '0 9 * * 1-5' },
  { label: 'Every Sunday at midnight', expr: '0 0 * * 0' },
  { label: '1st of every month at midnight', expr: '0 0 1 * *' },
];

export const CronParser: React.FC = () => {
  const [expression, setExpression] = useState('*/15 * * * *');

  // Explain cron
  const explanation = useMemo(() => {
    try {
      const text = cronstrue.toString(expression, { use24HourTimeFormat: true, throwExceptionOnParseError: true });
      return { success: true, text, error: null };
    } catch (e: unknown) {
      return { success: false, text: '', error: (e as Error).message };
    }
  }, [expression]);

  // Cron fields split
  const fields = expression.trim().split(/\s+/);

  // Approximate next run times calculator
  const nextRuns = useMemo(() => {
    if (!explanation.success || fields.length !== 5) return [];

    const runs: Date[] = [];
    const now = new Date();
    // Start searching forward from next minute
    let checkTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

    const matchField = (val: number, field: string, min: number, max: number): boolean => {
      if (field === '*') return true;
      if (field.startsWith('*/')) {
        const step = parseInt(field.slice(2), 10);
        return !isNaN(step) && val % step === 0;
      }
      if (field.includes(',')) {
        return field.split(',').some((sub) => matchField(val, sub, min, max));
      }
      if (field.includes('-')) {
        const [start, end] = field.split('-').map(Number);
        return val >= start && val <= end;
      }
      return parseInt(field, 10) === val;
    };

    let iterations = 0;
    while (runs.length < 5 && iterations < 10000) {
      iterations++;
      const min = checkTime.getMinutes();
      const hr = checkTime.getHours();
      const dom = checkTime.getDate();
      const mon = checkTime.getMonth() + 1;
      const dow = checkTime.getDay();

      const minMatch = matchField(min, fields[0], 0, 59);
      const hrMatch = matchField(hr, fields[1], 0, 23);
      const domMatch = matchField(dom, fields[2], 1, 31);
      const monMatch = matchField(mon, fields[3], 1, 12);
      const dowMatch = matchField(dow, fields[4], 0, 6);

      if (minMatch && hrMatch && domMatch && monMatch && dowMatch) {
        runs.push(new Date(checkTime));
      }

      // advance by 1 minute
      checkTime = new Date(checkTime.getTime() + 60000);
    }

    return runs;
  }, [expression, explanation.success, fields]);

  return (
    <div className="space-y-6">
      {/* Expression Input & Presets */}
      <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400">
            Cron Expression (5-part format)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="* * * * *"
              className="flex-1 px-4 py-2.5 bg-[#090d14] border border-slate-800 rounded-xl text-slate-100 font-mono text-sm tracking-widest focus:outline-none focus:border-emerald-500"
            />
            <CopyButton text={expression} label="Copy Expression" />
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-500 font-medium block">
            Quick Templates:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setExpression(p.expr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  expression === p.expr
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Human Readable Explanation Banner */}
      {explanation.success ? (
        <div className="p-5 bg-gradient-to-r from-emerald-950/40 to-slate-900/40 border border-emerald-500/30 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Human-Friendly Meaning
          </div>
          <p className="text-lg font-medium text-white tracking-tight">
            &ldquo;{explanation.text}&rdquo;
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2 p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-rose-200">Invalid Cron Expression</span>
            {explanation.error}
          </div>
        </div>
      )}

      {/* Field Structure Guide */}
      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Cron Fields Breakdown
        </h3>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { label: 'Minute', range: '0 - 59', val: fields[0] || '*' },
            { label: 'Hour', range: '0 - 23', val: fields[1] || '*' },
            { label: 'Day of Month', range: '1 - 31', val: fields[2] || '*' },
            { label: 'Month', range: '1 - 12', val: fields[3] || '*' },
            { label: 'Day of Week', range: '0 - 6 (Sun-Sat)', val: fields[4] || '*' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-lg space-y-1"
            >
              <div className="font-mono text-sm font-bold text-emerald-400">{item.val}</div>
              <div className="font-medium text-slate-200">{item.label}</div>
              <div className="text-[10px] text-slate-500">{item.range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Upcoming Runs */}
      {nextRuns.length > 0 && (
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Next 5 Scheduled Executions</span>
          </div>

          <div className="divide-y divide-slate-800/60 rounded-lg border border-slate-800 bg-[#090d14] overflow-hidden">
            {nextRuns.map((date, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-2.5 text-xs hover:bg-slate-850/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-right font-mono text-slate-600 font-semibold">
                    #{idx + 1}
                  </span>
                  <span className="font-mono text-slate-200 font-medium">
                    {date.toLocaleString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {date.toISOString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
