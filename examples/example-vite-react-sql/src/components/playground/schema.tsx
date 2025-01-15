import { useToriiSQLQuery } from "@dojoengine/sdk/sql";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface Row {
    table_name: string;
    column_name: string;
    data_type: string;
    is_primary_key: boolean;
}
interface Table {
    table_name: string;
    columns: Array<Row>;
}
type Rows = Array<Row>;
type Schema = Array<Table>;

const SCHEMA_QUERY = `
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
function formatSchema(rows: Rows) {
    let result: Schema = [];
    for (const row of rows) {
        const table = result.find((i) => i.table_name === row.table_name);
        if (table) {
            table.columns = [...table.columns, row];
            continue;
        }
        result = [...result, { table_name: row.table_name, columns: [row] }];
    }
    return result;
}

export function Schema() {
    const { data: schema } = useToriiSQLQuery(SCHEMA_QUERY, formatSchema);
    return (
        <div>
            <Accordion type="single" collapsible>
                <AccordionItem value="schema-main">
                    <AccordionTrigger>Schema:</AccordionTrigger>
                    <AccordionContent>
                        <Accordion type="single" collapsible>
                            {schema.map((table: Table, idx: number) => (
                                <Table key={idx} table={table} />
                            ))}
                        </Accordion>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

function Table({ table }: { table: Table }) {
    return (
        <AccordionItem value={table.table_name}>
            <AccordionTrigger>{table.table_name}</AccordionTrigger>
            <AccordionContent>
                <ul>
                    {table.columns.map((col, idx) => {
                        return <li key={idx}>{col.column_name}</li>;
                    })}
                </ul>
            </AccordionContent>
        </AccordionItem>
    );
}
