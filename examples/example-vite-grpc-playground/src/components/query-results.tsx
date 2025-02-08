import { Alert } from "./ui/alert";
import { Button } from "./ui/button";

interface QueryResultsProps {
    response: any;
    error: string | null;
    loading: boolean;
    executionTime: number | null;
    onDownload: () => void;
}

export const QueryResults = ({
    response,
    error,
    loading,
    executionTime,
    onDownload,
}: QueryResultsProps) => {
    return (
        <>
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Results</h2>
                {response && (
                    <Button variant="outline" onClick={onDownload}>
                        ⇩ Download JSON
                    </Button>
                )}
            </div>
            <div className="flex-1 p-4 overflow-auto">
                {error && <Alert variant="destructive">! {error}</Alert>}
                {response && response.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-800">
                            <thead className="bg-zinc-900">
                                <tr>
                                    {Object.keys(response[0]).map((header) => (
                                        <th
                                            key={header}
                                            className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {response.map((row: any, rowIndex: number) => (
                                    <tr
                                        key={rowIndex}
                                        className={
                                            rowIndex % 2 === 0
                                                ? "bg-zinc-900"
                                                : "bg-zinc-900/50"
                                        }
                                    >
                                        {Object.values(row).map(
                                            (value, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300 font-mono"
                                                >
                                                    {value === null ? (
                                                        <span className="text-zinc-500 italic">
                                                            NULL
                                                        </span>
                                                    ) : typeof value ===
                                                      "object" ? (
                                                        JSON.stringify(value)
                                                    ) : (
                                                        String(value)
                                                    )}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {(!response || response.length === 0) && !error && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                        <p className="text-lg font-medium">No Results Yet</p>
                        <p className="text-sm">
                            Execute a query to see results here
                        </p>
                    </div>
                )}
            </div>
            {response && (
                <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-zinc-400">
                            Showing {response.length} row
                            {response.length !== 1 ? "s" : ""}
                        </p>
                        {executionTime && (
                            <p className="text-sm text-zinc-500">
                                {executionTime.toFixed(0)}ms
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
