import {
    useQuery as useTanStackQuery,
    UseQueryOptions,
} from "@tanstack/react-query";

/**
 * Simple function to query Torii instance over sql endpoint.
 *
 * This endpoint is mainly meant to be used as analytical query system.
 * For more informations and examples, head over to `examples/example-vite-react-sql` example
 *
 *
 * @template Input - The type your data have raw, just straight out of sql
 * @template Output - The type that will have your data after going through `formatFn`
 * @param {string} toriiUrl - Torii url
 * @param {string} query - Your raw sql query
 * @param {(rows: Input) => Output} formatFn - Format function callback
 * @returns {Promise<Output>} - Formatted data
 */
export async function queryTorii<Input, Output>(
    toriiUrl: string,
    query: string,
    formatFn: (rows: Input) => Output
): Promise<Output> {
    try {
        const response = await fetch(`${toriiUrl}/sql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: query,
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        return formatFn(await response.json());
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

/**
 *
 */
export function useToriiSQLQuery<Output, Input>(
    query: string,
    formatFn: (rows: Input) => Output,
    defaultValue?: UseQueryOptions<Output>["placeholderData"],
    toriiUrl?: string
) {
    const { data, error, isPending, isRefetching } = useTanStackQuery({
        queryKey: [query],
        queryFn: async () => {
            return await queryTorii(
                toriiUrl ?? "http://127.0.0.1:8080",
                query,
                formatFn
            );
        },
        // @ts-expect-error trust me
        placeholderData: defaultValue ?? [],
    });

    return {
        data,
        error,
        isPending,
        isRefetching,
    };
}
