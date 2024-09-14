export type PrimitiveType = string | number | boolean;

export type SchemaType = {
    [key: string]: {
        [key: string]: any;
    };
};

export type QueryOptions = {
    where?: Record<string, any>;
    limit?: number;
    offset?: number;
};

export type QueryType<T extends SchemaType> = {
    entityIds?: string[];
} & {
    [K in keyof T]?: {
        [L in keyof T[K]]?: {
            $?: QueryOptions;
        };
    };
};

export type SubscriptionQueryType<T extends SchemaType> = {
    entityIds?: string[];
} & {
    [K in keyof T]?: {
        [L in keyof T[K]]?: true | string[];
    };
};

export type QueryResult<T extends SchemaType> = {
    [K in keyof T]: {
        [L in keyof T[K]]: Array<{
            [P in keyof T[K][L]]: T[K][L][P] extends SchemaType
                ? QueryResult<T[K][L][P]>
                : T[K][L][P];
        }>;
    };
};
