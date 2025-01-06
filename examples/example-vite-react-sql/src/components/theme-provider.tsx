import {
    ThemeProvider as NextThemesProvider,
    ThemeProviderProps,
} from "next-themes";
import { useCallback, useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "dojo-react-sql-theme";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

type Theme = "light" | "dark" | "system";

export const useTheme = () => {
    // @ts-expect-error
    const [internalTheme, setInternalTheme] = useState<Theme>(undefined);

    const setTheme = useCallback((theme: Theme) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, theme);
        setInternalTheme(theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, []);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)")) {
            setInternalTheme("dark");
        } else {
            setInternalTheme("light");
        }
    }, []);

    return { theme: internalTheme, setTheme };
};
