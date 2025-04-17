import type { SchemaType as ISchemaType } from "../internal/types";

import {
    CairoCustomEnum,
    CairoOption,
    CairoOptionVariant,
    type BigNumberish,
} from "starknet";

export type TypedCairoEnum<T> = CairoCustomEnum & {
    variant: { [K in keyof T]: T[K] | undefined };
    unwrap(): T[keyof T];
};

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `onchain_dash::models::CallerCounter` struct
export interface CallerCounter {
    caller: string;
    counter: BigNumberish;
    timestamp: CairoOption<BigNumberish>;
}

// Type definition for `onchain_dash::models::CallerCounterValue` struct
export interface CallerCounterValue {
    counter: BigNumberish;
    timestamp: CairoOption<BigNumberish>;
}

// Type definition for `onchain_dash::models::CustomTheme` struct
export interface CustomTheme {
    classname: BigNumberish;
}

// Type definition for `onchain_dash::models::GlobalCounter` struct
export interface GlobalCounter {
    global_counter_key: BigNumberish;
    counter: BigNumberish;
}

// Type definition for `onchain_dash::models::GlobalCounterValue` struct
export interface GlobalCounterValue {
    counter: BigNumberish;
}

// Type definition for `onchain_dash::models::Message` struct
export interface Message {
    identity: string;
    content: string;
    timestamp: BigNumberish;
}

// Type definition for `onchain_dash::models::MessageValue` struct
export interface MessageValue {
    content: string;
}

// Type definition for `onchain_dash::models::Theme` struct
export interface Theme {
    theme_key: BigNumberish;
    value: DashboardThemeEnum;
    caller: string;
    timestamp: BigNumberish;
}

// Type definition for `onchain_dash::models::ThemeValue` struct
export interface ThemeValue {
    value: DashboardThemeEnum;
    caller: string;
    timestamp: BigNumberish;
}

// Type definition for `onchain_dash::models::AvailableTheme` enum
export enum AvailableTheme {
    Light,
    Dark,
    Dojo,
}

// Type definition for `onchain_dash::models::DashboardTheme` enum
export type DashboardTheme = {
    Predefined: AvailableTheme;
    Custom: CustomTheme;
};
export type DashboardThemeEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
    onchain_dash: {
        CallerCounter: WithFieldOrder<CallerCounter>;
        CallerCounterValue: WithFieldOrder<CallerCounterValue>;
        CustomTheme: WithFieldOrder<CustomTheme>;
        GlobalCounter: WithFieldOrder<GlobalCounter>;
        GlobalCounterValue: WithFieldOrder<GlobalCounterValue>;
        Message: WithFieldOrder<Message>;
        MessageValue: WithFieldOrder<MessageValue>;
        Theme: WithFieldOrder<Theme>;
        ThemeValue: WithFieldOrder<ThemeValue>;
    };
}
export const schema: SchemaType = {
    onchain_dash: {
        CallerCounter: {
            fieldOrder: ["caller", "counter", "timestamp"],
            caller: "",
            counter: 0,
            timestamp: new CairoOption(CairoOptionVariant.None),
        },
        CallerCounterValue: {
            fieldOrder: ["counter", "timestamp"],
            counter: 0,
            timestamp: new CairoOption(CairoOptionVariant.None),
        },
        CustomTheme: {
            fieldOrder: ["classname"],
            classname: 0,
        },
        GlobalCounter: {
            fieldOrder: ["global_counter_key", "counter"],
            global_counter_key: 0,
            counter: 0,
        },
        GlobalCounterValue: {
            fieldOrder: ["counter"],
            counter: 0,
        },
        Message: {
            fieldOrder: ["identity", "content", "timestamp"],
            identity: "",
            content: "",
            timestamp: 0,
        },
        MessageValue: {
            fieldOrder: ["content"],
            content: "",
        },
        Theme: {
            fieldOrder: ["theme_key", "value", "caller", "timestamp"],
            theme_key: 0,
            value: new CairoCustomEnum({
                Predefined: AvailableTheme.Light,
                custom: undefined,
            }),
            caller: "",
            timestamp: 0,
        },
        ThemeValue: {
            fieldOrder: ["value", "caller", "timestamp"],
            value: new CairoCustomEnum({
                Predefined: AvailableTheme.Light,
                custom: undefined,
            }),
            caller: "",
            timestamp: 0,
        },
    },
};
