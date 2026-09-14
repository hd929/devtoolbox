import React, { useState, useEffect } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Clock, Play, Pause } from 'lucide-react';

export const TimestampConverter: React.FC = () => {
  const [currentEpochSec, setCurrentEpochSec] = useState(Math.floor(Date.now() / 1000));
  const [isClockRunning, setIsClockRunning] = useState(true);

  // Epoch to Date input
  const [epochInput, setEpochInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  // Date to Epoch input
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 16));

  // Live clock tick
  useEffect(() => {
    if (!isClockRunning) return;
    const interval = setInterval(() => {
      setCurrentEpochSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isClockRunning]);

  // Parse epoch input
  const parsedFromEpoch = (() => {
    const raw = epochInput.trim();
    if (!raw) return null;
    let num = Number(raw);
    if (isNaN(num)) return null;

    // Detect milliseconds vs seconds (digits > 11 usually ms)
    const isMs = raw.length > 11;
    const date = new Date(isMs ? num : num * 1000);
    if (isNaN(date.getTime())) return null;

    // Relative calculation
    const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
    let relative = '';
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    if (Math.abs(diffSec) < 60) {
      relative = rtf.format(diffSec, 'second');
    } else if (Math.abs(diffSec) < 3600) {
      relative = rtf.format(Math.round(diffSec / 60), 'minute');
    } else if (Math.abs(diffSec) < 86400) {
      relative = rtf.format(Math.round(diffSec / 3600), 'hour');
    } else {
      relative = rtf.format(Math.round(diffSec / 86400), 'day');
    }

    return {
      date,
      isMs,
      seconds: isMs ? Math.floor(num / 1000) : num,
      milliseconds: isMs ? num : num * 1000,
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      relative,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  })();

  // Parse date picker input to epoch
  const parsedFromDate = (() => {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;
    const ms = date.getTime();
    const sec = Math.floor(ms / 1000);
    return {
      sec,
      ms,
      iso: date.toISOString(),
      utc: date.toUTCString(),
    };
  })();

  const setPreset = (type: 'now' | 'startOfDay' | 'endOfDay' | 'startOfMonth' | 'startOfYear') => {
    const now = new Date();
    let d = new Date();
    if (type === 'startOfDay') {
      d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if (type === 'endOfDay') {
      d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (type === 'startOfMonth') {
      d = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    } else if (type === 'startOfYear') {
      d = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    }
    const sec = Math.floor(d.getTime() / 1000).toString();
    setEpochInput(sec);
  };

  return (
    <div className="space-y-6">
      {/* Live Unix Epoch Ticker Bar */}
      <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Current Unix Epoch
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 tracking-wider">
              {currentEpochSec}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsClockRunning(!isClockRunning)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
          >
            {isClockRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" /> Resume
              </>
            )}
          </button>
          <CopyButton text={currentEpochSec.toString()} label="Copy Epoch" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Converter 1: Epoch to Human Date */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Timestamp to Date
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPreset('now')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] border border-slate-700/60 transition-colors"
              >
                Now
              </button>
              <button
                onClick={() => setPreset('startOfDay')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] border border-slate-700/60 transition-colors"
              >
                Today
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">
              Unix Timestamp (seconds or milliseconds)
            </label>
            <input
              type="text"
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              placeholder="e.g. 1715000000"
              className="w-full px-3 py-2 bg-[#090d14] border border-slate-800 rounded-lg text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {parsedFromEpoch ? (
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Local Time ({parsedFromEpoch.timezone})</span>
                  <span className="font-mono text-white font-medium">{parsedFromEpoch.local}</span>
                </div>
                <CopyButton text={parsedFromEpoch.local} iconOnly />
              </div>

              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">UTC / GMT</span>
                  <span className="font-mono text-slate-200">{parsedFromEpoch.utc}</span>
                </div>
                <CopyButton text={parsedFromEpoch.utc} iconOnly />
              </div>

              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">ISO 8601</span>
                  <span className="font-mono text-emerald-400">{parsedFromEpoch.iso}</span>
                </div>
                <CopyButton text={parsedFromEpoch.iso} iconOnly />
              </div>

              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Relative Time</span>
                  <span className="font-semibold text-slate-200">{parsedFromEpoch.relative}</span>
                </div>
                <span className="text-[10px] text-slate-500 px-2 py-0.5 bg-slate-900 rounded">
                  Format: {parsedFromEpoch.isMs ? 'Milliseconds' : 'Seconds'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-rose-400 p-2">Please enter a valid numeric timestamp.</p>
          )}
        </div>

        {/* Converter 2: Human Date to Epoch */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Date to Timestamp
            </h2>
            <button
              onClick={() => setDateInput(new Date().toISOString().slice(0, 16))}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] border border-slate-700/60 transition-colors"
            >
              Reset to Now
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400">Select Date & Time (Local)</label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090d14] border border-slate-800 rounded-lg text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
            />
          </div>

          {parsedFromDate && (
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Seconds (Unix Epoch)</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {parsedFromDate.sec}
                  </span>
                </div>
                <CopyButton text={parsedFromDate.sec.toString()} />
              </div>

              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Milliseconds</span>
                  <span className="font-mono text-slate-200">{parsedFromDate.ms}</span>
                </div>
                <CopyButton text={parsedFromDate.ms.toString()} />
              </div>

              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/40 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">ISO 8601</span>
                  <span className="font-mono text-slate-300">{parsedFromDate.iso}</span>
                </div>
                <CopyButton text={parsedFromDate.iso} iconOnly />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
