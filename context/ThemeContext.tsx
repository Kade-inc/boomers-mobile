import { createContext, ReactNode, useEffect, useState } from "react";
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "react-hook-form";

type ThemeContextType = {
    currentTheme: string;
    isSystemTheme: boolean;
    toggleTheme: (newTheme: string) => void;
    useSystemTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    currentTheme: 'light',
    isSystemTheme: false,
    toggleTheme: () => {},
    useSystemTheme: () => {}
})

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = useColorScheme();
    const defaultTheme = colorScheme === 'dark' ? 'dark' : 'light';
    const [theme, setTheme] = useState(defaultTheme);
    const [isSystemTheme, setIsSystemTheme] = useState(false);

    useEffect(() => {
        const getTheme = async () => {
            try {
                const savedThemeObject = await AsyncStorage.getItem('theme');
                const savedThemeObjectData = JSON.parse(savedThemeObject!);

                if (savedThemeObjectData) {
                    setTheme(savedThemeObjectData.mode);
                    setIsSystemTheme(savedThemeObjectData.system);
                } 
            } catch (error) {
                console.log("Error in loading theme. ", error);
            }
        }
        getTheme();
    }, []);

    useEffect(() => {
        if (colorScheme && isSystemTheme) {
            const themeObject = {
                mode: colorScheme,
                system: true,
            }
            setTheme(colorScheme);
            AsyncStorage.setItem('theme', JSON.stringify(themeObject));
            setIsSystemTheme(true);
        }
    }, [colorScheme]);

    const toggleTheme = (newTheme: string) => {
        const themeObject = {
            mode: newTheme,
            system: false,
        }
        setTheme(newTheme);
        AsyncStorage.setItem('theme', JSON.stringify(themeObject));
        setIsSystemTheme(false);
    }

    const useSystemTheme = () => {
        if (colorScheme) {
            const themeObject = {
                mode: colorScheme,
                system: true,
            }
            AsyncStorage.setItem('theme', JSON.stringify(themeObject));
            setTheme(colorScheme);
            setIsSystemTheme(true);
        }
        // const colorScheme = useColorScheme();
        // setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        // AsyncStorage.setItem('theme', colorScheme === 'dark' ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider value={{ currentTheme: theme, toggleTheme, useSystemTheme, isSystemTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;