import { SchemaType } from "@/typescript/models.gen";
import { DojoContext } from "@dojoengine/sdk/react";
import { useToriiSQLQuery } from "@dojoengine/sdk/sql";
import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

type QueryResponse = Array<{
    count: number;
    direction: string;
}>;

type DirectionCount = {
    Left: number;
    Up: number;
    Down: number;
    Right: number;
};

const DIRECTION_COUNT_QUERY = `SELECT 
    JSON_EXTRACT(data, '$.direction') as direction,
    COUNT(*) as count
FROM event_messages_historical
GROUP BY JSON_EXTRACT(data, '$.direction')`;

const defaultDirectionObject = { Left: 0, Up: 0, Down: 0, Right: 0 };

function parseDirection(str: string): string {
    const parsed = JSON.parse(str);
    return Object.keys(parsed)[0];
}

function formatFn(rows: QueryResponse): DirectionCount {
    const directions = defaultDirectionObject;
    rows.forEach((r) => {
        const direction = parseDirection(r.direction);
        // @ts-expect-error this is ok compiler
        directions[direction] = r.count;
    });
    return directions;
}

export function DirectionCount() {
    // use queryClient to invalidateQuery when state is changing.
    const { useDojoStore } = useContext(DojoContext);
    const queryClient = useQueryClient();
    useDojoStore.subscribe(
        (s: SchemaType) => s.entities,
        () => {
            queryClient.invalidateQueries({
                queryKey: [DIRECTION_COUNT_QUERY],
            });
        }
    );

    // use the isRefetching prop here so that react knows the state is changing and actually rerender compoentnt
    // @ts-expect-error it's ok if I dont use this variable compiler, react needs it
    const { data: directions, isRefetching } = useToriiSQLQuery(
        DIRECTION_COUNT_QUERY,
        formatFn
    );

    if (!directions) {
        return (
            <div>
                Player went :<br />
                Left <b>0</b> times
                <br />
                Up <b>0</b> times
                <br />
                Down <b>0</b> times
                <br />
                Right <b>0</b> times
                <br />
            </div>
        );
    }

    return (
        <div>
            Player went :<br />
            Left <b>{directions.Left}</b> times
            <br />
            Up <b>{directions.Up}</b> times
            <br />
            Down <b>{directions.Down}</b> times
            <br />
            Right <b>{directions.Right}</b> times
            <br />
        </div>
    );
}
