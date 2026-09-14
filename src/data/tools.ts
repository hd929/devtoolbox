import { ToolItem, ToolCategory } from '../types';

export const CATEGORIES: { id: ToolCategory; label: string }[] = [
  { id: 'formatters', label: 'Formatters & Viewers' },
  { id: 'security', label: 'Security & Encoders' },
  { id: 'converters', label: 'Converters & Parsers' },
  { id: 'text-media', label: 'Text & Media' },
];

export const TOOLS: ToolItem[] = [
  // Formatters
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, minify, and inspect JSON documents with tree/code views',
    category: 'formatters',
    icon: 'FileJson',
    tags: ['json', 'format', 'minify', 'prettify', 'validate', 'tree'],
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries with custom dialect & indentation rules',
    category: 'formatters',
    icon: 'Database',
    tags: ['sql', 'format', 'database', 'query', 'mysql', 'postgres'],
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Real-time side-by-side Markdown editor with GitHub Flavored Markdown preview',
    category: 'formatters',
    icon: 'FileText',
    tags: ['markdown', 'preview', 'gfm', 'editor', 'html', 'docs'],
  },
  {
    id: 'diff-viewer',
    name: 'Diff Viewer',
    description: 'Compare text and code with side-by-side & unified split line diffing',
    category: 'formatters',
    icon: 'GitCompare',
    tags: ['diff', 'compare', 'text', 'code', 'git', 'changes'],
  },

  // Security & Encoders
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode JSON Web Tokens, inspect header & payload, and check expiry status',
    category: 'security',
    icon: 'KeyRound',
    tags: ['jwt', 'token', 'auth', 'decode', 'claims', 'bearer'],
  },
  {
    id: 'base64',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode and decode UTF-8 text, files, and preview Base64 encoded images',
    category: 'security',
    icon: 'Binary',
    tags: ['base64', 'encode', 'decode', 'dataurl', 'image', 'binary'],
  },
  {
    id: 'url-encode',
    name: 'URL Encode / Decode',
    description: 'Encode and decode standard URLs, components, and query parameter maps',
    category: 'security',
    icon: 'Link2',
    tags: ['url', 'uri', 'encode', 'decode', 'querystring', 'params'],
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) and HMAC digests',
    category: 'security',
    icon: 'ShieldCheck',
    tags: ['hash', 'md5', 'sha256', 'sha512', 'hmac', 'crypto', 'checksum'],
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate standard UUID v4, v1 in bulk with custom format & hyphen options',
    category: 'security',
    icon: 'Fingerprint',
    tags: ['uuid', 'guid', 'v4', 'random', 'unique', 'id'],
  },

  // Converters & Parsers
  {
    id: 'cron-parser',
    name: 'Cron Parser',
    description: 'Human-friendly crontab schedule explainer and upcoming trigger dates preview',
    category: 'converters',
    icon: 'Clock',
    tags: ['cron', 'crontab', 'schedule', 'parser', 'timer', 'explain'],
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert Unix epoch timestamps to human dates, UTC, ISO 8601, and live clock',
    category: 'converters',
    icon: 'CalendarClock',
    tags: ['timestamp', 'unix', 'epoch', 'date', 'time', 'iso8601'],
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, HSV, CMYK with picker and palette shades',
    category: 'converters',
    icon: 'Palette',
    tags: ['color', 'hex', 'rgb', 'hsl', 'cmyk', 'picker', 'palette', 'css'],
  },

  // Text & Media
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Interactive regular expression testing with real-time match & capture group analysis',
    category: 'text-media',
    icon: 'Regex',
    tags: ['regex', 'regexp', 'regular-expression', 'tester', 'pattern', 'matches'],
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: '100% in-browser image compression and resizing with before/after quality comparison',
    category: 'text-media',
    icon: 'ImageIcon',
    tags: ['image', 'compress', 'optimize', 'resize', 'jpeg', 'png', 'webp'],
  },
];
