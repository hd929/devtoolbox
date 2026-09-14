import React, { useState, useMemo } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { AlertTriangle, BookOpen } from 'lucide-react';

const COMMON_PATTERNS = [
  { name: 'Email Address', pattern: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})', flags: 'g' },
  { name: 'URL (Web)', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)', flags: 'g' },
  { name: 'IPv4 Address', pattern: '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g' },
  { name: 'HEX Color', pattern: '#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})', flags: 'g' },
  { name: 'Date (YYYY-MM-DD)', pattern: '(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])', flags: 'g' },
  { name: 'Slug / Kebab-case', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', flags: '' },
];

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({
    g: true,
    i: false,
    m: false,
    s: false,
  });
  const [testString, setTestString] = useState(
    'Contact our team at support@ajitana.io.vn or sales@example.com for inquiries!\nAnother invalid mail is user@.com'
  );
  const [replacement, setReplacement] = useState('**$1@masked.domain**');

  const flagStr = Object.keys(flags)
    .filter((k) => flags[k])
    .join('');

  // Evaluate regex
  const result = useMemo(() => {
    if (!pattern) {
      return { matches: [], error: null, highlightedText: testString };
    }
    try {
      const regex = new RegExp(pattern, flagStr);
      const matches: { text: string; index: number; groups: string[] }[] = [];

      if (flags.g) {
        let match;
        let iteration = 0;
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          iteration++;
          if (iteration > 1000) break; // safety guard
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      return { matches, error: null };
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flagStr, testString, flags.g]);

  // Substituted string
  const substituted = useMemo(() => {
    if (!pattern || result.error) return '';
    try {
      const regex = new RegExp(pattern, flagStr);
      return testString.replace(regex, replacement);
    } catch {
      return '';
    }
  }, [pattern, flagStr, testString, replacement, result.error]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  return (
    <div className="space-y-6">
      {/* Pattern Input & Flag Controls */}
      <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 flex items-center bg-[#090d14] border border-slate-800 rounded-xl px-3 py-1 focus-within:border-emerald-500/80 transition-colors">
            <span className="text-slate-500 font-mono text-base mr-1">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regular expression..."
              className="flex-1 bg-transparent py-2 text-xs font-mono text-emerald-300 focus:outline-none"
            />
            <span className="text-slate-500 font-mono text-base ml-1">/{flagStr}</span>
          </div>

          {/* Flags toggles */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 border border-slate-700/60 rounded-lg shrink-0">
            {[
              { id: 'g', label: 'Global (g)' },
              { id: 'i', label: 'Insensitive (i)' },
              { id: 'm', label: 'Multiline (m)' },
              { id: 's', label: 'Singleline (s)' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFlag(f.id)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  flags[f.id]
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
                title={f.label}
              >
                {f.id}
              </button>
            ))}
          </div>
        </div>

        {/* Common Preset Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Presets:
          </span>
          {COMMON_PATTERNS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setPattern(preset.pattern);
                setFlags({
                  g: preset.flags.includes('g'),
                  i: preset.flags.includes('i'),
                  m: preset.flags.includes('m'),
                  s: preset.flags.includes('s'),
                });
              }}
              className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {result.error && (
        <div className="flex items-start gap-2 p-3 bg-rose-950/40 border border-rose-800/70 rounded-xl text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>Regex Error: {result.error}</span>
        </div>
      )}

      {/* Test String Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-400">Test String</label>
          <span className="text-xs font-mono text-emerald-400">
            {result.matches.length} {result.matches.length === 1 ? 'match' : 'matches'} found
          </span>
        </div>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={6}
          placeholder="Paste or type test string here..."
          className="w-full p-3.5 rounded-xl border border-slate-800 bg-[#090d14] text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500/60 resize-y leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Match Details & Groups */}
      {result.matches.length > 0 && (
        <div className="space-y-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <h3 className="text-xs font-semibold text-slate-300">
            Match Groups Breakdown
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {result.matches.map((m, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-semibold">
                    Match #{idx + 1} (Index: {m.index})
                  </span>
                  <CopyButton text={m.text} label="Copy Match" />
                </div>
                <div className="font-mono text-slate-200 bg-slate-950/60 p-2 rounded border border-slate-800">
                  {m.text}
                </div>
                {m.groups.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1.5">
                    {m.groups.map((grp, gIdx) => (
                      <div
                        key={gIdx}
                        className="flex items-center justify-between px-2 py-1 bg-slate-900 rounded border border-slate-800 text-[11px]"
                      >
                        <span className="text-slate-400 font-mono">Group ${gIdx + 1}:</span>
                        <span className="text-purple-300 font-mono font-medium truncate ml-2">
                          {grp ?? 'undefined'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Substitution Test */}
      <div className="space-y-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Regex Replacement / Substitution
          </label>
          <CopyButton text={substituted} label="Copy Result" />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            placeholder="Replacement string (e.g. $1, $2, or custom text)"
            className="flex-1 px-3 py-2 bg-[#090d14] border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="p-3 bg-[#090d14] border border-slate-800 rounded-lg text-xs font-mono text-slate-300 whitespace-pre-wrap">
          {substituted || <span className="text-slate-600">No output</span>}
        </div>
      </div>
    </div>
  );
};
