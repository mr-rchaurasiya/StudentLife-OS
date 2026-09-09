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
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9000,
        maxWidth: '380px',
        width: 'calc(100% - 40px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'auto'
      }}
    >
      {!isOnline && (
        <div 
          style={{
            padding: '12px 16px',
            borderRadius: '16px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#fde68a',
            fontSize: '0.78rem',
            fontWeight: 600
          }}
        >
          <WifiOff size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
          <span>Offline Mode Active &bull; Local Cached Flashcards &amp; Notes are accessible!</span>
        </div>
      )}

      {isInstallable && !isDismissed && (
        <div 
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: '20px',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Download size={20} color="#ffffff" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Install StudentLife OS</h4>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Instant home screen &amp; offline launch</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleInstallClick}
              className="glow-hover"
              style={{
                padding: '7px 14px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Install
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PwaInstallPromptWidget;
