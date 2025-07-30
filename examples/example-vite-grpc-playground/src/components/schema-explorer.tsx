import { useState } from "react";

export type SchemaItem = {
    table_name: string;
    column_name: string;
    data_type: string;
    is_primary_key: boolean;
    is_nullable: boolean;
};
interface SchemaExplorerProps {
    schema: SchemaItem[];
}
export const SchemaExplorer = ({ schema }: SchemaExplorerProps) => {
    const [expandedTables, setExpandedTables] = useState<{
        [x: string]: boolean | SchemaItem[];
    }>({});

    // Group schema by table
    const tableSchema = schema.reduce(
        (acc: Record<string, SchemaItem[]>, row: SchemaItem) => {
            if (!acc[row.table_name]) {
                acc[row.table_name] = [];
            }
            acc[row.table_name].push(row);
            return acc;
        },
        {}
    );

    return (
        <div className="h-full overflow-y-auto">
            <div className="space-y-2 p-4">
                {Object.entries(tableSchema).map(([tableName, columns]) => (
                    <div
                        key={tableName}
                        className="border border-zinc-800 rounded-lg"
                    >
                        <div
                            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-zinc-800"
                            onClick={() =>
                                setExpandedTables((prev) => ({
                                    ...prev,
                                    [tableName]: !prev[tableName],
                                }))
                            }
                        >
                            <span>{expandedTables[tableName] ? "▼" : "▶"}</span>
                            <span>{tableName}</span>
                        </div>
                        {expandedTables[tableName] && (
                            <div className="pl-8 pr-2 pb-2 space-y-1">
                                {columns.map((column) => (
                                    <div
                                        key={column.column_name}
                                        className="flex items-center gap-2 text-sm text-zinc-400"
                                    >
                                        <span>{column.column_name}</span>
                                        <span className="text-zinc-500 text-xs">
                                            ({column.data_type}
                                            {column.is_primary_key
                                                ? ", PK"
                                                : ""}
                                            {column.is_nullable
                                                ? ""
                                                : ", NOT NULL"}
                                            )
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
