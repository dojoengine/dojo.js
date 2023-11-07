import { Type as RecsType, Schema } from "@dojoengine/recs";

export const parseComponent = ({
    component,
    values,
}: {
    component: Schema;
    values: any;
}) => {
    return Object.keys(component.schema).reduce((acc: any, key: any) => {
        acc[key] =
            //@ts-ignore
            component.schema[key] === RecsType.BigInt
                ? BigInt(values[key])
                : Number(values[key]);
        return acc;
    }, {});
};
