import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c45b9e9dc98743ebb9fdffd4a02bf3ac',
  appName: 'Karlo Shaadi',
  webDir: 'dist',
  server: {
    url: 'https://c45b9e9d-c987-43eb-b9fd-ffd4a02bf3ac.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#FFF5F5',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    // Deep linking configuration
    App: {
      // URL scheme for deep links (karloshaadi://)
      launchUrl: 'karloshaadi://',
    },
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    // Universal links configuration for iOS
    // Will be handled in Xcode with Associated Domains entitlement
  },
  android: {
    allowMixedContent: true,
    // Android App Links will be configured in AndroidManifest.xml
  },
};

export default config;
