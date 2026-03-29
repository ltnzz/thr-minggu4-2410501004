import { createContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const lightColors = {
    background: '#F9FAFB',
    card: '#ffffff',
    text: '#1F2937',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    primary: '#4F46E5',
    surfaceBudget: '#E0E7FF',
    surfaceBudgetIcon: '#BFDBFE',
    surfacePacking: '#F3E8FF',
    surfacePackingIcon: '#E9D5FF',
    surfaceFamily: '#FEF3C7',
    surfaceFamilyIcon: '#FDE68A',
    miniBox: '#ffffff',
    modalBg: '#ffffff',
};

export const darkColors = {
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    textMuted: '#9CA3AF',
    border: '#374151',
    primary: '#6366F1',
    surfaceBudget: '#1E1B4B',
    surfaceBudgetIcon: '#312E81',
    surfacePacking: '#3B0764',
    surfacePackingIcon: '#581C87',
    surfaceFamily: '#451A03',
    surfaceFamilyIcon: '#78350F',
    miniBox: '#374151',
    modalBg: '#1F2937',
};

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('@theme_mode');
            setIsDarkMode(
                savedTheme !== null ? savedTheme === 'dark' : systemColorScheme === 'dark',
            );
        };
        loadTheme();
    }, [systemColorScheme]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newTheme = !prev;
            AsyncStorage.setItem('@theme_mode', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    const colors = isDarkMode ? darkColors : lightColors;
    const contextValue = useMemo(() => ({ isDarkMode, toggleTheme, colors }), [isDarkMode, colors]);

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
