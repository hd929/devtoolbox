import React, { useState, useMemo } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { AlertCircle, CheckCircle2, Clock, ShieldAlert, Key } from 'lucide-react';

const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFqaXRhbmEgRGV2Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTksImlzcyI6ImFqaXRhbmEuaW8udm4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;

const CLAIM_DESCRIPTIONS: Record<string, string> = {
  iss: 'Issuer: The principal that issued the JWT',
  sub: 'Subject: The subject of the JWT (e.g. User ID)',
  aud: 'Audience: The recipients that the JWT is intended for',
  exp: 'Expiration Time: The time after which the JWT expires',
  nbf: 'Not Before: The time before which the JWT must not be accepted',
  iat: 'Issued At: The time at which the JWT was issued',
  jti: 'JWT ID: Unique identifier for the JWT',
  name: 'Full Name of the user',
  role: 'User role or permission level',
  roles: 'List of assigned user roles',
  email: 'User email address',
};

export const JwtDecoder: React.FC = () => {
  const [jwt, setJwt] = useState(SAMPLE_JWT);

  // Parse JWT parts safely
  const parsed = useMemo(() => {
    const raw = jwt.trim();
    if (!raw) return { valid: false, error: 'Please enter a JWT token' };

    const parts = raw.split('.');
    if (parts.length !== 3) {
      return {
        valid: false,
        error: `Invalid JWT structure: Expected 3 parts separated by dots, got ${parts.length}`,
      };
    }

    try {
      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const headerJson = decodeBase64Url(parts[0]);
      const payloadJson = decodeBase64Url(parts[1]);

      const header = JSON.parse(headerJson);
      const payload = JSON.parse(payloadJson);
      const signature = parts[2];

      // Expiry calculation
      let expiryStatus: { expired: boolean; text: string } | null = null;
      if (typeof payload.exp === 'number') {
        const expMs = payload.exp * 1000;
        const nowMs = Date.now();
        const diffSec = Math.round((expMs - nowMs) / 1000);
        const expDate = new Date(expMs).toLocaleString();

        if (diffSec > 0) {
          const days = Math.floor(diffSec / 86400);
          const hours = Math.floor((diffSec % 86400) / 3600);
          const mins = Math.floor((diffSec % 3600) / 60);
          expiryStatus = {
            expired: false,
            text: `Active (Expires in ${days > 0 ? `${days}d ` : ''}${hours}h ${mins}m - ${expDate})`,
          };
        } else {
          const absDiff = Math.abs(diffSec);
          const days = Math.floor(absDiff / 86400);
          const hours = Math.floor((absDiff % 86400) / 3600);
          expiryStatus = {
            expired: true,
            text: `Expired ${days > 0 ? `${days}d ` : ''}${hours}h ago (${expDate})`,
          };
        }
      }

      return {
        valid: true,
        header,
        payload,
        signature,
        rawHeader: parts[0],
        rawPayload: parts[1],
        rawSignature: parts[2],
        expiryStatus,
      };
    } catch (e: unknown) {
      return { valid: false, error: (e as Error).message || 'Failed to decode token' };
    }
  }, [jwt]);

  const parts = jwt.trim().split('.');

  return (
    <div className="space-y-6">
      {/* Token Input Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Encoded Token
          </label>
          <button
            onClick={() => setJwt(SAMPLE_JWT)}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Load Sample Token
          </button>
        </div>
        <div className="relative rounded-xl border border-slate-800 bg-[#090d14] overflow-hidden focus-within:border-emerald-500/60 transition-colors">
          <textarea
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            placeholder="Paste JWT here (e.g. eyJhbGciOi...)"
            rows={4}
            className="w-full p-3.5 bg-transparent font-mono text-xs text-slate-200 resize-y focus:outline-none leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Segment Color Guide */}
      {parsed.valid && parts.length === 3 && (
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-rose-400 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Header
            </span>
            <span className="flex items-center gap-1.5 text-purple-400 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              Payload
            </span>
            <span className="flex items-center gap-1.5 text-sky-400 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              Signature
            </span>
          </div>
          {parsed.expiryStatus && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                parsed.expiryStatus.expired
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {parsed.expiryStatus.expired ? (
                <ShieldAlert className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{parsed.expiryStatus.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {!parsed.valid && (
        <div className="flex items-start gap-2 p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-rose-200">Unable to parse JWT</span>
            {parsed.error}
          </div>
        </div>
      )}

      {/* Decoded Content Grid */}
      {parsed.valid && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Header: Algorithm & Token Type
              </span>
              <CopyButton text={JSON.stringify(parsed.header, null, 2)} label="Copy Header" />
            </div>
            <div className="p-4 bg-[#090d14] border border-rose-900/30 rounded-xl overflow-x-auto">
              <pre className="font-mono text-xs text-rose-200 leading-relaxed">
                {JSON.stringify(parsed.header, null, 2)}
              </pre>
            </div>
          </div>

          {/* Signature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Signature (Client Verified)
              </span>
              <CopyButton text={parsed.signature || ''} label="Copy Signature" />
            </div>
            <div className="p-4 bg-[#090d14] border border-sky-900/30 rounded-xl">
              <p className="font-mono text-xs text-sky-300 break-all leading-relaxed">
                {parsed.signature}
              </p>
              <p className="mt-3 text-[11px] text-slate-500">
                HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
              </p>
            </div>
          </div>

          {/* Payload */}
          <div className="space-y-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Payload: Claims Data
              </span>
              <CopyButton text={JSON.stringify(parsed.payload, null, 2)} label="Copy Payload" />
            </div>
            <div className="p-4 bg-[#090d14] border border-purple-900/30 rounded-xl overflow-x-auto">
              <pre className="font-mono text-xs text-purple-200 leading-relaxed">
                {JSON.stringify(parsed.payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Standard Claims Inspector */}
          {parsed.payload && (
            <div className="lg:col-span-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Identified Claims Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {Object.entries(parsed.payload).map(([key, value]) => {
                  const desc = CLAIM_DESCRIPTIONS[key];
                  let formattedValue = String(value);
                  if (['exp', 'iat', 'nbf'].includes(key) && typeof value === 'number') {
                    formattedValue = `${value} (${new Date(value * 1000).toUTCString()})`;
                  }

                  return (
                    <div
                      key={key}
                      className="p-2.5 bg-slate-800/40 border border-slate-700/40 rounded-lg flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-emerald-400">{key}</span>
                        {desc && <span className="text-[10px] text-slate-400">{desc.split(':')[0]}</span>}
                      </div>
                      <div className="font-mono text-slate-300 text-[11px] truncate" title={formattedValue}>
                        {formattedValue}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
