import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X } from 'lucide-react';

interface PwaInstallPromptWidgetProps {
  onAddXp?: (xp: number, reason: string) => void;
}

export const PwaInstallPromptWidget: React.FC<PwaInstallPromptWidgetProps> = ({
  onAddXp
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.log('[PWA] Service Worker registration skipped in dev mode:', err);
        });
    }

    // Install prompt listener
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install StudentLife OS:\n1. Tap the Share or 3-dots Menu in your browser\n2. Click "Install app" or "Add to Home Screen"');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      onAddXp?.(30, 'Installed StudentLife OS PWA App');
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (isDismissed && isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm w-full animate-slideUp">
      {!isOnline && (
        <div className="mb-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl shadow-2xl flex items-center gap-3 text-amber-300 text-xs font-semibold">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Offline Mode Active • Local Cached Flashcards & Notes are accessible!</span>
        </div>
      )}

      {isInstallable && !isDismissed && (
        <div className="p-4 rounded-3xl bg-slate-900/95 border border-indigo-500/40 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/40">
              <Download className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Install StudentLife OS App</h4>
              <p className="text-[11px] text-slate-400 leading-tight">Instant access from your home screen</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition"
            >
              Install
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-white transition"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PwaInstallPromptWidget;
