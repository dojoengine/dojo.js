import { useQuery } from "@/hooks/useQuery";

type QueryResponse = Array<{
    totalEntities: string;
}>;

const TOTAL_ENTITIES_QUERY =
    "SELECT count(id) as totalEntities from 'entities'";

function formatFn(rows: QueryResponse): number {
    return parseInt(rows[0].totalEntities);
}

export function TotalEntities() {
    const { data: totalEntities } = useQuery(TOTAL_ENTITIES_QUERY, formatFn);
    return (
        <div>
            Total player spawned :
            <br />
            <b>{totalEntities}</b>
        </div>
    );
}
