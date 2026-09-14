import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToolHeader } from './components/common/ToolHeader';
import { ToastProvider, useToast } from './context/ToastContext';
import { TOOLS } from './data/tools';

// Tools components
import { JsonFormatter } from './tools/JsonFormatter';
import { JwtDecoder } from './tools/JwtDecoder';
import { Base64Tool } from './tools/Base64Tool';
import { UrlEncoder } from './tools/UrlEncoder';
import { RegexTester } from './tools/RegexTester';
import { UuidGenerator } from './tools/UuidGenerator';
import { HashGenerator } from './tools/HashGenerator';
import { CronParser } from './tools/CronParser';
import { TimestampConverter } from './tools/TimestampConverter';
import { ColorConverter } from './tools/ColorConverter';
import { SqlFormatter } from './tools/SqlFormatter';
import { MarkdownPreview } from './tools/MarkdownPreview';
import { DiffViewer } from './tools/DiffViewer';
import { ImageCompressor } from './tools/ImageCompressor';

const STORAGE_KEY_ACTIVE = 'devtoolbox_active_tool';
const STORAGE_KEY_FAVS = 'devtoolbox_favorites';

const AppContent: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE) || 'json-formatter';
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FAVS);
      return stored ? JSON.parse(stored) : ['json-formatter', 'jwt-decoder', 'base64', 'uuid-generator'];
    } catch {
      return ['json-formatter', 'jwt-decoder', 'base64', 'uuid-generator'];
    }
  });

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const { showToast } = useToast();

  // Sync active tool to localStorage
  const handleSelectTool = (toolId: string) => {
    setActiveToolId(toolId);
    localStorage.setItem(STORAGE_KEY_ACTIVE, toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite
  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(toolId);
      const next = exists ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(next));
      showToast(exists ? 'Removed from favorites' : 'Added to favorites', 'info');
      return next;
    });
  };

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeTool = TOOLS.find((t) => t.id === activeToolId) || TOOLS[0];
  const isFav = favorites.includes(activeTool.id);

  // Render tool view
  const renderActiveToolComponent = () => {
    switch (activeTool.id) {
      case 'json-formatter':
        return <JsonFormatter />;
      case 'jwt-decoder':
        return <JwtDecoder />;
      case 'base64':
        return <Base64Tool />;
      case 'url-encode':
        return <UrlEncoder />;
      case 'regex-tester':
        return <RegexTester />;
      case 'uuid-generator':
        return <UuidGenerator />;
      case 'hash-generator':
        return <HashGenerator />;
      case 'cron-parser':
        return <CronParser />;
      case 'timestamp-converter':
        return <TimestampConverter />;
      case 'color-converter':
        return <ColorConverter />;
      case 'sql-formatter':
        return <SqlFormatter />;
      case 'markdown-preview':
        return <MarkdownPreview />;
      case 'diff-viewer':
        return <DiffViewer />;
      case 'image-compressor':
        return <ImageCompressor />;
      default:
        return <JsonFormatter />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0c1017]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeToolId={activeTool.id}
        onSelectTool={handleSelectTool}
        favorites={favorites}
        searchQuery={sidebarSearch}
        setSearchQuery={setSidebarSearch}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTool={activeTool}
          onOpenCommandPalette={() => setIsPaletteOpen(true)}
          onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          {/* Tool Header with Favorite & Privacy indicator */}
          <ToolHeader
            tool={activeTool}
            isFavorite={isFav}
            onToggleFavorite={() => toggleFavorite(activeTool.id)}
          />

          {/* Active Tool Body */}
          <div className="transition-all duration-150">
            {renderActiveToolComponent()}
          </div>
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectTool={handleSelectTool}
        favorites={favorites}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
