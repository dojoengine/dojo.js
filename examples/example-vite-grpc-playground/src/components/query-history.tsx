export type QueryItem = {
    query: string;
    favorite: boolean;
    timestamp: number;
    rows: number;
};
interface QueryHistoryProps {
    queries: QueryItem[];
    onSelectQuery: (query: string) => void;
    onToggleFavorite: (favoriteIdx: number) => void;
}

export const QueryHistory = ({
    queries,
    onSelectQuery,
    onToggleFavorite,
}: QueryHistoryProps) => {
    return (
        <div className="space-y-2 p-4">
            {queries.map((item, index) => (
                <div
                    key={index}
                    className="p-2 hover:bg-zinc-800 rounded cursor-pointer group border border-zinc-800"
                >
                    <div className="flex items-center justify-between">
                        <div
                            className="flex-1 cursor-pointer"
                            onClick={() => onSelectQuery(item.query)}
                        >
                            <div className="text-sm font-mono text-zinc-300 line-clamp-1">
                                {item.query}
                            </div>
                        </div>
                        <button
                            className="p-1 hover:text-yellow-500 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(index);
                            }}
                        >
                            {item.favorite ? "★" : "☆"}
                        </button>
                    </div>
                    <div className="text-xs text-zinc-500 flex justify-between mt-1">
                        <span>
                            {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                        {item.rows != null && <span>{item.rows} rows</span>}
                    </div>
                </div>
            ))}
        </div>
    );
};
