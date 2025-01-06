import { useQuery as useTanStackQuery } from "@tanstack/react-query";

const fetchSchema = async (query: string, formatFn: Function) => {
    try {
        const response = await fetch(`http://localhost:8080/sql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: query,
        });
        if (!response.ok) throw new Error("Failed to fetch schema");
        return formatFn(await response.json());
    } catch (error) {
        console.error("Error fetching schema:", error);
        throw error;
    }
};

export function useQuery<Output, Input>(
    query: string,
    formatFn: (rows: Input) => Output,
    defaultValue?: Output
) {
    const { data, error, isPending, isRefetching } = useTanStackQuery({
        queryKey: [query],
        queryFn: async () => {
            return await fetchSchema(query, formatFn);
        },
        placeholderData: defaultValue ?? [],
    });

    return {
        data,
        error,
        isPending,
        isRefetching,
    };
}
