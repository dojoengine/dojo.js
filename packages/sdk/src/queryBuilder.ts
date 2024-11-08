import { QueryType, SchemaType } from "./types";
export class QueryBuilder<T extends SchemaType> {
    namespaces: Map<string, Namespace<T>>;

    constructor() {
        this.namespaces = new Map<string, Namespace<T>>();
    }

    public namespace(
        name: string,
        cb: (ns: Namespace<T>) => void
    ): Namespace<T> {
        const ns = new Namespace(this, name);
        this.namespaces.set(name, ns);
        cb(ns);
        return ns;
    }

    public build(): QueryType<T> {
        const qt: Record<
            string,
            Record<
                string,
                { $: { where: Record<string, Record<string, any>> } }
            >
        > = {};
        for (const [ns, namespace] of this.namespaces) {
            qt[ns] = {};
            for (const [entity, entityObj] of namespace.entities) {
                const constraints: Record<string, Record<string, any>> = {};
                for (const [field, constraint] of entityObj.constraints) {
                    constraints[field] = {
                        [`${constraint.operator}`]: constraint.value,
                    };
                }
                qt[ns][entity] = {
                    $: {
                        where: {
                            ...(qt[ns]?.[entity]?.$?.where ?? {}),
                            ...constraints,
                        },
                    },
                };
            }
        }
        return qt as QueryType<T>;
    }
}

class Namespace<T extends SchemaType> {
    entities: Map<string, QueryEntity<T>>;

    constructor(
        private parent: QueryBuilder<T>,
        private name: string
    ) {
        this.entities = new Map<string, QueryEntity<T>>();
    }

    public entity(
        name: string,
        cb: (entity: QueryEntity<T>) => void
    ): QueryEntity<T> {
        const entity = new QueryEntity(this, name);
        this.entities.set(name, entity);
        cb(entity);
        return entity;
    }

    public namespace(ns: string, cb: (ns: Namespace<T>) => void): Namespace<T> {
        return this.parent.namespace(ns, cb);
    }

    public build(): QueryType<T> {
        return this.parent.build();
    }
}

class QueryEntity<T extends SchemaType> {
    constraints: Map<string, Constraint<T>>;

    constructor(
        private parent: Namespace<T>,
        private name: string
    ) {
        this.constraints = new Map<string, Constraint<T>>();
    }

    public is(field: string, value: any): QueryEntity<T> {
        this.constraints.set(field, new Constraint(this, Operator.is, value));
        return this;
    }

    public eq(field: string, value: any): QueryEntity<T> {
        this.constraints.set(field, new Constraint(this, Operator.eq, value));
        return this;
    }

    public neq(field: string, value: any): QueryEntity<T> {
        this.constraints.set(field, new Constraint(this, Operator.neq, value));
        return this;
    }

    public gt(field: string, value: any): QueryEntity<T> {
        this.constraints.set(field, new Constraint(this, Operator.gt, value));
        return this;
    }

    public gte(field: string, value: any): QueryEntity<T> {
        this.constraints.set(field, new Constraint(this, Operator.gte, value));
        return this;
    }

    public lt(field: string, value: any): QueryEntity<T> {
        this.constraints.set(field, new Constraint(this, Operator.lt, value));
        return this;
    }

    public lte(field: string, value: any): QueryEntity<T> {
        this.constraints.set(field, new Constraint(this, Operator.lte, value));
        return this;
    }

    public build(): QueryType<T> {
        return this.parent.build();
    }
}

class Constraint<T extends SchemaType> {
    constructor(
        private parent: QueryEntity<T>,
        private _operator: Operator,
        private _value: any
    ) {}

    get operator(): string {
        return this._operator.toString();
    }

    get value(): any {
        return this._value;
    }
}

enum Operator {
    is = "$is",
    eq = "$eq",
    neq = "$neq",
    gt = "$gt",
    gte = "$gte",
    lt = "$lt",
    lte = "$lte",
}
