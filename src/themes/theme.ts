import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Extender la interfaz de colores para incluir propiedades personalizadas
declare global {
    namespace ReactNativePaper {
        interface ThemeColors {
            headerBackground: string;
            headerTint: string;
            tabBarBackground: string;
            tabBarActiveTint: string;
            tabBarInactiveTint: string;
        }
    }
}

export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#6200ee',
        secondary: '#03dac6',
        background: '#ffffff',
        surface: '#ffffff',
        error: '#b00020',
        // Colores para Expo Router
        headerBackground: '#6200ee',
        headerTint: '#ffffff',
        tabBarBackground: '#ffffff',
        tabBarActiveTint: '#6200ee',
        tabBarInactiveTint: '#757575',
    },
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#bb86fc',
        secondary: '#03dac6',
        background: '#121212',
        surface: '#1e1e1e',
        error: '#cf6679',
        // Colores para Expo Router
        headerBackground: '#1e1e1e',
        headerTint: '#ffffff',
        tabBarBackground: '#1e1e1e',
        tabBarActiveTint: '#bb86fc',
        tabBarInactiveTint: '#a0a0a0',
    },
};