import React from 'react';

interface ThemeToggleButtonProps {
  theme: string;
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ theme, toggleTheme }) => {
  return (
    <div
      className={`relative w-20 h-10 rounded-full transition-colors duration-300 cursor-pointer ${
        theme === 'light' ? 'bg-yellow-500' : 'bg-blue-800'
      }`}
      onMouseUp={toggleTheme}
      onTouchEnd={toggleTheme}
    >
      <div
        className={`absolute top-1 left-1 w-8 h-8 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          theme === 'light' ? 'translate-x-10' : ''
        }`}
      ></div>
      <span
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
          theme === 'light' ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
      >
        🌞
      </span>
      <span
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
          theme === 'light' ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}
      >
        🌜
      </span>
    </div>
  );
};

export default ThemeToggleButton;
