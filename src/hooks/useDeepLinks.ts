import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapacitor, getCapacitorPlugins } from './useCapacitor';

export function useDeepLinks() {
  const navigate = useNavigate();
  const { isNative } = useCapacitor();

  useEffect(() => {
    if (!isNative) return;
    
    const plugins = getCapacitorPlugins();
    if (!plugins?.App) return;

    const App = plugins.App;

    // Handle app opened via deep link
    const handleAppUrlOpen = (data: { url: string }) => {
      const url = data.url;
      console.log('Deep link received:', url);
      
      // Parse the deep link URL
      const path = parseDeepLink(url);
      if (path) {
        navigate(path);
      }
    };

    // Listen for deep link events
    const listener = App.addListener('appUrlOpen', handleAppUrlOpen);

    // Check if app was launched via deep link
    App.getLaunchUrl().then((result) => {
      if (result?.url) {
        handleAppUrlOpen(result);
      }
    });

    return () => {
      listener.remove();
    };
  }, [isNative, navigate]);
}

function parseDeepLink(url: string): string | null {
  try {
    // Handle custom scheme: karloshaadi://path
    if (url.startsWith('karloshaadi://')) {
      const path = url.replace('karloshaadi:/', '');
      return path.startsWith('/') ? path : `/${path}`;
    }

    // Handle universal links: https://karloshaadi.com/path
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Only handle our domains
    const validDomains = [
      'karloshaadi.com',
      'www.karloshaadi.com',
      'app.karloshaadi.com',
      'lovableproject.com'
    ];
    
    if (validDomains.some(domain => hostname.includes(domain))) {
      return urlObj.pathname + urlObj.search;
    }

    return null;
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
}

// Helper function to generate shareable deep links
export function generateDeepLink(path: string): { 
  universalLink: string; 
  appLink: string;
  webLink: string;
} {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return {
    universalLink: `https://karloshaadi.com${cleanPath}`,
    appLink: `karloshaadi:/${cleanPath}`,
    webLink: `https://c45b9e9d-c987-43eb-b9fd-ffd4a02bf3ac.lovableproject.com${cleanPath}`,
  };
}

// Shareable links for specific content types
export function getVendorShareLink(vendorId: string) {
  return generateDeepLink(`/vendors/${vendorId}`);
}

export function getBookingShareLink(bookingId: string) {
  return generateDeepLink(`/booking/${bookingId}`);
}

export function getStoryShareLink(storyId: string) {
  return generateDeepLink(`/stories/${storyId}`);
}
