import type { SchemaType } from "@dojoengine/sdk";


export interface GlobalCounter {
  fieldOrder: string[];
  id: string;
  counter: number;
  global_counter_key: number
}
export interface CallerCounter {
  fieldOrder: string[];
  id: string;
  counter: number;
  caller: string;
}
export interface OnchainDashSchemaType extends SchemaType {
  world: {
    global_counter: GlobalCounter;
    caller_counter: CallerCounter;
  };
}

export const schema: OnchainDashSchemaType = {
  world: {
    global_counter: {
      fieldOrder: ["id", "counter", "global_counter_key"],
      id: "",
      counter: 0,
      global_counter_key: 9999999,
    },
    caller_counter: {
      fieldOrder: ["id", "counter", "caller"],
      id: "",
      counter: 0,
      caller: "",
    },
  },
};

