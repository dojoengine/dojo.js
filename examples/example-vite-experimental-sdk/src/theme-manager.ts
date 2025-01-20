/**
 * A simple theme manager for the playground,
 * using highlight.js.
 */
export class ThemeManager {
    currentTheme: number;
    themes: string[];
    constructor() {
        this.themes = [
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-light.min.css",
        ];
        this.currentTheme = 0;
        this.setupToggleButton();
    }

    /**
     * Setups a button to toggle the theme.
     * The button is positioned at the top right of the screen.
     */
    setupToggleButton() {
        const button = document.createElement("button");
        button.id = "themeToggle";
        button.textContent = "Toggle Theme";
        button.style.position = "fixed";
        button.style.top = "10px";
        button.style.right = "10px";
        button.style.padding = "5px";

        button.onclick = () => this.toggleTheme();
        document.body.appendChild(button);
    }

    toggleTheme() {
        this.currentTheme = (this.currentTheme + 1) % this.themes.length;
        (
            document.querySelector('link[rel="stylesheet"]')! as HTMLLinkElement
        ).href = this.themes[this.currentTheme];
    }
}
