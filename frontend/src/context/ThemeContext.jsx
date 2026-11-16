import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// DARK MODE ONLY — Official KOON Luxury Palette (#0B0A09, #151310, #C6A15B, #D8BD83, #F5F0E7)
export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    try {
      localStorage.removeItem('kawn_theme');
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
