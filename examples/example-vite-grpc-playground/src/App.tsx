import { useState, useEffect, useCallback } from "react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { QueryHistory, type QueryItem } from "./components/query-history";
import { SchemaExplorer, type SchemaItem } from "./components/schema-explorer";
import { QueryEditor } from "./components/query-editor";
import { QueryResults } from "./components/query-results";
import type {
    StandardizedQueryResult,
    SchemaType,
    init,
} from "@dojoengine/sdk";
import { evaluateUserInput } from "./components/ts-executor";

const DEFAULT_COMMENT = `// Welcome to Torii gRPC Playground!
// This is a sandboxed environment. All you need is return the value you want.
// Try running a query like:`;

const DEFAULT_QUERY = `${DEFAULT_COMMENT}
return new ToriiQueryBuilder().build();`;

interface AppProps {
    sdk: Awaited<ReturnType<typeof init>>;
}
export const App = ({ sdk }: AppProps) => {
    const [query, setQuery] = useState<string>(DEFAULT_QUERY);
    const [response, setResponse] =
        useState<StandardizedQueryResult<SchemaType> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);
    const [schema, setSchema] = useState<SchemaItem[]>([]);
    const [activeTab, setActiveTab] = useState<string>("editor");
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [queryHistory, setQueryHistory] = useState<QueryItem[]>(() => {
        // Load history from localStorage on init
        const saved = localStorage.getItem("queryHistory");
        return saved ? JSON.parse(saved) : [];
    });

    // Save history to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("queryHistory", JSON.stringify(queryHistory));
    }, [queryHistory]);

    // Fetch schema on component mount
    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const schemaQuery = `
          SELECT 
            m.name as table_name,
            p.name as column_name,
            p.type as data_type,
            p."notnull" as is_nullable,
            p.pk as is_primary_key
          FROM sqlite_master m
          JOIN pragma_table_info(m.name) p
          WHERE m.type = 'table'
          AND m.name NOT LIKE 'sqlite_%'
          ORDER BY m.name, p.cid;
        `;
                const response = await fetch(
                    `http://localhost:8080/sql?${new URLSearchParams({ query: schemaQuery })}`
                );
                if (!response.ok) throw new Error("Failed to fetch schema");
                const data = await response.json();
                setSchema(data);
            } catch (error) {
                console.error("Error fetching schema:", error);
            }
        };
        fetchSchema();
    }, []);

    const handleToggleFavorite = (index: number) => {
        setQueryHistory((prev) => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                favorite: !updated[index].favorite,
            };
            // Sort to keep favorites at the top
            return updated.sort((a, b) => {
                if (a.favorite === b.favorite) {
                    return b.timestamp - a.timestamp;
                }
                return b.favorite ? 1 : -1;
            });
        });
    };

    const beautifyCurrentQuery = () => {
        const beautified = query;
        setQuery(beautified);
    };

    const executeQuery = async () => {
        setLoading(true);
        setError(null);
        const strippedQuery = query.replace(DEFAULT_COMMENT, "");
        try {
            const evaluatedQuery = await evaluateUserInput(strippedQuery);

            const startTime = performance.now();
            const response = await sdk.getEntities({
                query: evaluatedQuery,
            });
            const endTime = performance.now();
            setExecutionTime(endTime - startTime);
            setResponse(response.getItems());

            // Add to history with deduplication
            setQueryHistory((prev) => {
                const existingIndex = prev.findIndex(
                    (item) => item.query.trim() === strippedQuery.trim()
                );

                const newEntry = {
                    query: strippedQuery,
                    timestamp: Date.now(),
                    rows: response.getItems().length,
                    executionTime: endTime - startTime,
                    favorite:
                        existingIndex >= 0
                            ? prev[existingIndex].favorite
                            : false,
                };

                let updated: QueryItem[];
                if (existingIndex >= 0) {
                    updated = [
                        newEntry,
                        ...prev.slice(0, existingIndex),
                        ...prev.slice(existingIndex + 1),
                    ];
                } else {
                    updated = [newEntry, ...prev.slice(0, 49)]; // Keep last 50 queries
                }

                return updated.sort((a, b) => {
                    if (a.favorite === b.favorite) {
                        return b.timestamp - a.timestamp;
                    }
                    return b.favorite ? 1 : -1;
                });
            });
        } catch (error) {
            setError((error as Error).message.toString());
            setResponse(null);
            setExecutionTime(null);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(query);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, [query]);

    const downloadResults = useCallback(() => {
        if (!response) return;
        const blob = new Blob([JSON.stringify(response, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "query-results.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [response]);

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <div className="max-w-8xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-white">
                            Torii gRPC Playground
                        </h1>
                        <span className="px-2 py-1 rounded-full bg-zinc-800 text-xs text-zinc-400">
                            BETA
                        </span>
                    </div>
                    <p className="text-zinc-400">
                        Write and execute gRPC queries in real-time
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="flex space-x-2">
                            <Button
                                variant={
                                    activeTab === "editor"
                                        ? undefined
                                        : "outline"
                                }
                                onClick={() => setActiveTab("editor")}
                                className="flex-1"
                            >
                                Editor
                            </Button>
                            <Button
                                variant={
                                    activeTab === "schema"
                                        ? undefined
                                        : "outline"
                                }
                                onClick={() => setActiveTab("schema")}
                                className="flex-1"
                            >
                                Schema
                            </Button>
                            <Button
                                variant={
                                    activeTab === "history"
                                        ? undefined
                                        : "outline"
                                }
                                onClick={() => setActiveTab("history")}
                                className="flex-1"
                            >
                                History
                            </Button>
                        </div>

                        <Card className="flex flex-col h-[calc(75vh-48px)]">
                            {activeTab === "history" ? (
                                <QueryHistory
                                    queries={queryHistory}
                                    onSelectQuery={(query) => {
                                        setQuery(query);
                                        setActiveTab("editor");
                                    }}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ) : activeTab === "editor" ? (
                                <QueryEditor
                                    query={query}
                                    setQuery={setQuery}
                                    onExecute={executeQuery}
                                    loading={loading}
                                    onBeautify={beautifyCurrentQuery}
                                    onCopy={copyToClipboard}
                                    copied={copied}
                                />
                            ) : (
                                <SchemaExplorer schema={schema} />
                            )}
                        </Card>
                    </div>

                    <Card className="flex flex-col h-[75vh]">
                        <QueryResults
                            response={response}
                            error={error}
                            loading={loading}
                            executionTime={executionTime}
                            onDownload={downloadResults}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
};
