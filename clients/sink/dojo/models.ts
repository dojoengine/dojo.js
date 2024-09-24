import type { SchemaType } from "@dojoengine/sdk";


export interface GlobalCounter {
  fieldOrder: string[];
  id: string;
  counter: number;
}
export interface CallerCounter {
  fieldOrder: string[];
  id: string;
  counter: number;
}
export interface OnchainDashSchemaType extends SchemaType {
  world: {
    global: GlobalCounter;
    caller: CallerCounter;
  };
}

export const schema: OnchainDashSchemaType = {
  world: {
    global: {
      fieldOrder: ["id", "counter"],
      id: "",
      counter: 0,
    },
    caller: {
      fieldOrder: ["id", "counter"],
      id: "",
      counter: 0,
    },
  },
};

