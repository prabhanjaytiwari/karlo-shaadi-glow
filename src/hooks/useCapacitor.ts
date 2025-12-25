import { useState, useEffect } from 'react';

interface CapacitorApp {
  addListener: (event: string, callback: (data: { url: string }) => void) => { remove: () => void };
  getLaunchUrl: () => Promise<{ url: string } | null>;
}

interface CapacitorPlugins {
  App?: CapacitorApp;
  SplashScreen?: {
    hide: () => Promise<void>;
    show: () => Promise<void>;
  };
  StatusBar?: {
    setStyle: (options: { style: 'dark' | 'light' }) => Promise<void>;
    setBackgroundColor: (options: { color: string }) => Promise<void>;
  };
}

interface CapacitorInstance {
  isNativePlatform: () => boolean;
  getPlatform: () => string;
  Plugins?: CapacitorPlugins;
}

declare global {
  interface Window {
    Capacitor?: CapacitorInstance;
  }
}

export function useCapacitor() {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');
  const [plugins, setPlugins] = useState<CapacitorPlugins | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Capacitor) {
      setIsNative(window.Capacitor.isNativePlatform());
      const p = window.Capacitor.getPlatform();
      setPlatform(p === 'ios' ? 'ios' : p === 'android' ? 'android' : 'web');
      setPlugins(window.Capacitor.Plugins);
    }
  }, []);

  return { isNative, platform, plugins };
}

export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && 
         window.Capacitor !== undefined && 
         window.Capacitor.isNativePlatform();
}

export function getCapacitorPlugins(): CapacitorPlugins | undefined {
  return typeof window !== 'undefined' ? window.Capacitor?.Plugins : undefined;
}
