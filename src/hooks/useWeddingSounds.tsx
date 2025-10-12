import { useEffect, useRef } from 'react';

export const useWeddingSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    
    document.addEventListener('click', initAudioContext, { once: true });
    return () => document.removeEventListener('click', initAudioContext);
  }, []);

  // Welcome shehnai sound (plays on page load)
  const playWelcomeSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  // Camera shutter sound for photography
  const playCameraSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  // Restaurant/catering bell sound
  const playCateringSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // Music note/celebration sound
  const playMusicSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // Sparkle/decoration sound
  const playDecorationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // Gentle chime for mehendi
  const playMehendiSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  // Venue/location sound
  const playVenueSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  return {
    playWelcomeSound,
    playCameraSound,
    playCateringSound,
    playMusicSound,
    playDecorationSound,
    playMehendiSound,
    playVenueSound,
  };
};
