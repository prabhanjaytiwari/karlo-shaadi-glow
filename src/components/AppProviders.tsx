import { useDeepLinks } from '@/hooks/useDeepLinks';
import { SplashScreen } from '@/components/native/SplashScreen';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  // Initialize deep links listener
  useDeepLinks();

  return (
    <>
      <SplashScreen />
      {children}
    </>
  );
}
