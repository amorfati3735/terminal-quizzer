
import React from 'react';
import { ThemeIcon } from './icons';

interface ThemeToggleProps {
  cycleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ cycleTheme }) => {
  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300"
      aria-label="Change theme"
    >
      <ThemeIcon className="w-6 h-6 accent-text" />
    </button>
  );
};

export default ThemeToggle;