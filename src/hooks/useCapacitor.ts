import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform: () => boolean;
      getPlatform: () => string;
    };
  }
}

export function useCapacitor() {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Capacitor) {
      setIsNative(window.Capacitor.isNativePlatform());
      const p = window.Capacitor.getPlatform();
      setPlatform(p === 'ios' ? 'ios' : p === 'android' ? 'android' : 'web');
    }
  }, []);

  return { isNative, platform };
}

export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && 
         window.Capacitor !== undefined && 
         window.Capacitor.isNativePlatform();
}
