import { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import { Button } from "./ui/button";
import * as ts from "typescript";
import sdkType from "@dojoengine/sdk/types?raw";

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    allowNonTsExtensions: true,
    lib: ["ESNext", "dom", "dojoenginesdk"],
});
monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `declare module dojoenginesdk { ${sdkType} };`,
    "sdk.d.ts"
);
// const dojoenginesdkModel = monaco.editor.createModel(
//     sdkType,
//     "typescript",
//     monaco.Uri.parse("sdk.d.ts")
// );

const sourceFile = ts.createSourceFile(
    "sdk.d.ts",
    sdkType,
    ts.ScriptTarget.Latest
);

// Step 2: Extract relevant information
const completionItems: Partial<monaco.languages.CompletionItem>[] = [];

function visit(node: ts.Node) {
    if (ts.isClassDeclaration(node) && node.name) {
        const className = node.name.text;
        completionItems.push({
            label: className,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: className,
            detail: `Class ${className}`,
        });

        node.members.forEach((member) => {
            if (ts.isMethodDeclaration(member) && member.name) {
                const methodName = member.name.getText(sourceFile);
                completionItems.push({
                    label: methodName,
                    kind: monaco.languages.CompletionItemKind.Method,
                    insertText: methodName,
                    detail: `Method ${methodName} of class ${className}`,
                });
            }
        });
    } else if (ts.isFunctionDeclaration(node) && node.name) {
        const functionName = node.name.text;
        completionItems.push({
            label: functionName,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: functionName,
            detail: `Function ${functionName}`,
        });
    } else if (ts.isInterfaceDeclaration(node) && node.name) {
        const interfaceName = node.name.text;
        completionItems.push({
            label: interfaceName,
            kind: monaco.languages.CompletionItemKind.Interface,
            insertText: interfaceName,
            detail: `Interface ${interfaceName}`,
        });
    } else if (ts.isTypeAliasDeclaration(node) && node.name) {
        const typeName = node.name.text;
        completionItems.push({
            label: typeName,
            kind: monaco.languages.CompletionItemKind.TypeParameter,
            insertText: typeName,
            detail: `Type ${typeName}`,
        });
    }

    ts.forEachChild(node, visit);
}

visit(sourceFile);

monaco.languages.registerCompletionItemProvider("typescript", {
    provideCompletionItems: (
        model: monaco.editor.ITextModel,
        position: monaco.Position
    ): monaco.languages.ProviderResult<monaco.languages.CompletionList> => {
        const word = model.getWordUntilPosition(position);
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
        };

        return {
            suggestions: completionItems.map((item) => ({
                ...item,
                range: range,
            })) as monaco.languages.CompletionItem[],
        };
    },
});

interface QueryEditorProps {
    setQuery: (...args: any) => any;
    onExecute: (...args: any) => any;
    onBeautify: (...args: any) => any;
    onCopy: (...args: any) => any;
    query: string;
    loading: boolean;
    copied: boolean;
}
export const QueryEditor = ({
    query,
    setQuery,
    onExecute,
    loading,
    onBeautify,
    onCopy,
    copied,
}: QueryEditorProps) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const resize = () => {
            if (editorRef.current) {
                editorRef.current.layout({ height: 0, width: 0 });
                editorRef.current.layout();
            }
        };
        window.addEventListener("resize", resize);
        setTimeout(() => resize); // push to next tick
        return () => window.removeEventListener("resize", resize);
    });

    useEffect(() => {
        if (elementRef.current) {
            editorRef.current = monaco.editor.create(elementRef.current, {
                value: query,
                language: "typescript",
                theme: "vs-dark",
                minimap: { enabled: false },
                fontSize: 14,
                // model: monaco.editor.getModel(monaco.Uri.parse("sdk.d.ts")),
            });

            editorRef.current.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space,
                () => {
                    editorRef.current?.trigger(
                        "keyboard",
                        "editor.action.triggerSuggest",
                        {}
                    );
                }
            );

            editorRef.current.onDidChangeModelContent(() => {
                setQuery(editorRef.current?.getValue());
            });
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.dispose();
            }
        };
    }, []);

    useEffect(() => {
        if (editorRef.current && editorRef.current.getValue() !== query) {
            editorRef.current.setValue(query);
        }
    }, [query]);

    return (
        <>
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                    Query Editor
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={onBeautify}>
                        ✨ Beautify
                    </Button>
                    <Button variant="outline" onClick={onCopy}>
                        {copied ? "✓ Copied!" : "Copy"}
                    </Button>
                </div>
            </div>
            <div className="flex-1 relative">
                <div
                    id="monaco-editor"
                    ref={elementRef}
                    className="absolute inset-0"
                />
            </div>
            <div className="p-4 border-t border-zinc-800">
                <Button
                    onClick={onExecute}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "⟳ Executing..." : "▶ Run Query"}
                </Button>
            </div>
        </>
    );
};
