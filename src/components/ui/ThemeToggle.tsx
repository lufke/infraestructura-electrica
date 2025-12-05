import { useThemeContext } from '@/src/contexts/ThemeContext';
import { IconButton } from 'react-native-paper';

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useThemeContext();

    return (
        <IconButton
            icon={isDark ? 'weather-sunny' : 'weather-night'}
            onPress={toggleTheme}
            size={24}
        />
    );
}