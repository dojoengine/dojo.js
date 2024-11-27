import { QueryType, SchemaType, SubscriptionQueryType } from "./types";

type FirstLevelKeys<ObjectType> = ObjectType extends object
    ? keyof ObjectType & (string | number)
    : never;

export class QueryBuilder<T extends SchemaType> {
    namespaces: Map<string, Namespace<T>>;

    constructor() {
        this.namespaces = new Map<string, Namespace<T>>();
    }

    public namespace(
        name: keyof T,
        cb: (ns: Namespace<T>) => void
    ): Namespace<T> {
        const ns = new Namespace(this);
        this.namespaces.set(name as string, ns);
        cb(ns);
        return ns;
    }

    public build(): SubscriptionQueryType<T> {
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
        return qt as SubscriptionQueryType<T>;
    }
}

class Namespace<T extends SchemaType> {
    entities: Map<string, QueryEntity<T>>;

    constructor(private parent: QueryBuilder<T>) {
        this.entities = new Map<string, QueryEntity<T>>();
    }

    public entity(
        name: FirstLevelKeys<T[keyof T & string]>,
        cb: (entity: QueryEntity<T>) => void
    ): QueryEntity<T> {
        const entity = new QueryEntity(this);
        this.entities.set(name as string, entity);
        cb(entity);
        return entity;
    }

    public namespace(ns: string, cb: (ns: Namespace<T>) => void): Namespace<T> {
        return this.parent.namespace(ns, cb);
    }

    public build(): SubscriptionQueryType<T> {
        return this.parent.build();
    }
}

class QueryEntity<T extends SchemaType> {
    constraints: Map<string, Constraint>;

    constructor(private parent: Namespace<T>) {
        this.constraints = new Map<string, Constraint>();
    }
    public entity(
        name: FirstLevelKeys<T[keyof T & string]>,
        cb: (entity: QueryEntity<T>) => void
    ): QueryEntity<T> {
        return this.parent.entity(name, cb);
    }

    public is(
        field: FirstLevelKeys<T[keyof T & string][keyof T[keyof T & string]]>,
        value: any
    ): QueryEntity<T> {
        return this.addConstraint(field, value, Operator.is);
    }

    public eq(
        field: FirstLevelKeys<T[keyof T & string][keyof T[keyof T & string]]>,
        value: any
    ): QueryEntity<T> {
        return this.addConstraint(field, value, Operator.eq);
    }

    public neq(
        field: FirstLevelKeys<T[keyof T & string][keyof T[keyof T & string]]>,
        value: any
    ): QueryEntity<T> {
        return this.addConstraint(field, value, Operator.neq);
    }

    public gt(
        field: FirstLevelKeys<T[keyof T & string][keyof T[keyof T & string]]>,
        value: any
    ): QueryEntity<T> {
        return this.addConstraint(field, value, Operator.gt);
    }

    public gte(
        field: FirstLevelKeys<T[keyof T & string][keyof T[keyof T & string]]>,
        value: any
    ): QueryEntity<T> {
        return this.addConstraint(field, value, Operator.gte);
    }

    public lt(
        field: FirstLevelKeys<T[keyof T & string][keyof T[keyof T & string]]>,
        value: any
    ): QueryEntity<T> {
        return this.addConstraint(field, value, Operator.lt);
    }

    public lte(
        field: FirstLevelKeys<T[keyof T & string][keyof T[keyof T & string]]>,
        value: any
    ): QueryEntity<T> {
        return this.addConstraint(field, value, Operator.lte);
    }

    private addConstraint(
        field: FirstLevelKeys<T[keyof T & string][keyof T[keyof T & string]]>,
        value: any,
        op: Operator
    ): QueryEntity<T> {
        this.constraints.set(field as string, new Constraint(op, value));
        return this;
    }

    public build(): QueryType<T> {
        return this.parent.build();
    }
}

class Constraint {
    constructor(
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
