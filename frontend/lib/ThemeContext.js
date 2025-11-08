import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getTheme } from './themes';
import { getSetting } from './api';

const ThemeContext = createContext();

export function ThemeProvider({ children, initialTheme = 'classic' }) {
  const [currentThemeId, setCurrentThemeId] = useState(initialTheme);
    const theme = useMemo(() => getTheme(currentThemeId), [currentThemeId]);

  useEffect(() => {
    // Load theme from settings
    getSetting('theme').then(data => {
        if (data?.active && data.active !== currentThemeId) {
          setCurrentThemeId(data.active);
      }
    }).catch(() => {});
  }, []);

    const contextValue = useMemo(() => ({
        theme,
        currentThemeId,
        setCurrentThemeId
    }), [theme, currentThemeId]);

    const cssVariables = useMemo(() => `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-light: ${theme.colors.textLight};
      --font-heading: ${theme.fonts.heading};
      --font-body: ${theme.fonts.body};
    }
    body {
      font-family: var(--font-body);
      color: var(--color-text);
      background-color: var(--color-background);
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
    }
  `, [theme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <style jsx global>{cssVariables}</style>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
