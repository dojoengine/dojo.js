import type { SchemaType } from "@dojoengine/sdk";


export interface GlobalCounter {
  fieldOrder: string[];
  counter: number;
  global_counter_key: number
}
export interface CallerCounter {
  fieldOrder: string[];
  counter: number;
  caller: string;
}
export interface Theme {
  fieldOrder: string[];
  theme_key: number;
  value: AvailableTheme;
  caller: string;
  timestamp: number;
}
export interface Message {
  fieldOrder: string[];
  identity: string;
  content: string;
  timestamp: number;
}

export enum AvailableTheme {
  Light,
  Dark,
  Dojo,
}

export const AvailableThemeClassMap: Record<number, string> = {
  0: 'light',
  1: 'dark',
  2: 'dojo'
};

export interface OnchainDashSchemaType extends SchemaType {
  onchain_dash: {
    GlobalCounter: GlobalCounter;
    CallerCounter: CallerCounter;
    Theme: Theme;
    Message: Message;
  };
}

export const schema: OnchainDashSchemaType = {
  onchain_dash: {
    GlobalCounter: {
      fieldOrder: ["counter", "global_counter_key"],
      counter: 0,
      global_counter_key: 9999999,
    },
    CallerCounter: {
      fieldOrder: ["counter", "caller"],
      counter: 0,
      caller: "",
    },
    Theme: {
      fieldOrder: ["theme_key", "value", "caller", "timestamp"],
      theme_key: 9999999,
      value: AvailableTheme.Light,
      caller: "",
      timestamp: 0,
    },
    Message: {
      fieldOrder: ["identity", "content", "timestamp"],
      identity: "",
      content: "",
      timestamp: 0,
    },
  },
};

