import hljs from "highlight.js";

/**
 * Manages the display and interaction of updates in the playground.
 */
export class UpdateManager {
    container: HTMLDivElement;
    constructor() {
        // Create the main container for updates
        this.container = document.createElement("div");
        this.container.id = "updates";
        this.container.style.cssText = `
            height: 80vh;
            overflow-y: auto;
            margin-top: 5vh;
            padding: 10px;
        `;
        document.body.appendChild(this.container);
    }

    /**
     * Displays an update in the updates div.
     *
     * The `updates` div must be defined in the HTML file.
     *
     * @param {Object} update - The update to display as a JSON object.
     */
    displayUpdate(title: string, update: any) {
        const updatesDiv = document.getElementById("updates")!;
        const updateContainer = document.createElement("div");
        updateContainer.style.position = "relative";

        const titleElement = document.createElement("div");
        titleElement.textContent = title;
        titleElement.style.cssText = `
        padding: 8px 12px;
        border-top: 1px solid #ddd;
        color: #666;
        font-family: monospace;
        font-size: 0.9em;
    `;

        const updateElement = document.createElement("pre");
        updateElement.style.margin = "8px";
        updateElement.style.padding = "12px";
        updateElement.style.backgroundColor = "#f5f5f5";
        updateElement.style.borderRadius = "4px";
        updateElement.style.fontFamily = "monospace";
        updateElement.style.fontSize = "10px";
        updateElement.innerHTML = `<code class="language-json">${JSON.stringify(update, null, 2)}</code>`;
        hljs.highlightElement(updateElement.firstChild! as HTMLElement);

        const copyButton = document.createElement("button");
        copyButton.textContent = "copy";
        copyButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 2px 4px;
        border: none;
        border-radius: 4px;
        background: #e0e0e0;
        cursor: pointer;
    `;

        copyButton.onclick = async () => {
            try {
                await navigator.clipboard.writeText(
                    JSON.stringify(update, null, 2)
                );
                copyButton.textContent = "✓";
                setTimeout(() => (copyButton.textContent = "copy"), 1000);
            } catch (err) {
                console.error("Failed to copy:", err);
                copyButton.textContent = "❌";
                setTimeout(() => (copyButton.textContent = "copy"), 1000);
            }
        };

        updateContainer.appendChild(titleElement);
        updateContainer.appendChild(updateElement);
        updateContainer.appendChild(copyButton);
        updatesDiv.appendChild(updateContainer);
        updatesDiv.scrollTop = updatesDiv.scrollHeight;
    }
}
