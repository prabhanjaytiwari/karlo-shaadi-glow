import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.karloshaadi.app',
  appName: 'Karlo Shaadi',
  webDir: 'dist',
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
