
import { useState, useEffect, useCallback } from 'react';

const HUES = [75, 60, 0, 180]; // Lime, Yellow, Red, Cyan

export const useTheme = () => {
  const [hueIndex, setHueIndex] = useState(0);

  useEffect(() => {
    const storedHueIndex = localStorage.getItem('termquiz-theme-hue-index');
    if (storedHueIndex) {
      setHueIndex(parseInt(storedHueIndex, 10));
    }
  }, []);

  useEffect(() => {
    const currentHue = HUES[hueIndex];
    document.documentElement.style.setProperty('--accent-color', `hsl(${currentHue}, 100%, 50%)`);
    document.documentElement.style.setProperty('--accent-color-transparent', `hsla(${currentHue}, 100%, 50%, 0.2)`);
    localStorage.setItem('termquiz-theme-hue-index', hueIndex.toString());
  }, [hueIndex]);

  const cycleTheme = useCallback(() => {
    setHueIndex(prevIndex => (prevIndex + 1) % HUES.length);
  }, []);

  return { cycleTheme };
};
