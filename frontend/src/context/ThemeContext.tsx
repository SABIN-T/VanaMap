import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    isPremium: boolean;
    toggleTheme: () => void;
    togglePremium: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as Theme) || 'dark';
    });

    const [isPremium, setIsPremium] = useState<boolean>(() => {
        return localStorage.getItem('isPremium') === 'true';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-premium', isPremium ? 'true' : 'false');
        if (isPremium) {
            document.body.classList.add('premium-mode');
        } else {
            document.body.classList.remove('premium-mode');
        }
        localStorage.setItem('isPremium', String(isPremium));
    }, [isPremium]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const togglePremium = () => {
        setIsPremium(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ theme, isPremium, toggleTheme, togglePremium }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
