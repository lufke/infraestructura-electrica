import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ThemeContextType {
    isDark: boolean;
    setIsDark: (isDark: boolean) => void;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    setIsDark: () => { },
    toggleTheme: () => { },
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);