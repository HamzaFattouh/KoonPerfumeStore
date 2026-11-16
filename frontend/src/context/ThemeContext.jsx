import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// DARK MODE ONLY — Locked to Dark Mode (#111111) with no light mode
export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    try {
      localStorage.setItem('kawn_theme', 'dark');
      const root = document.documentElement;
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      root.classList.remove('light');
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: 'dark',
        isDark: true,
        isLight: false,
        toggleTheme: () => {},
        setTheme: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
