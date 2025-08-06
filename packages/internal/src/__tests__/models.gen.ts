import {
    type BigNumberish,
    CairoCustomEnum,
    CairoOption,
    CairoOptionVariant,
} from "starknet";
import type { SchemaType as ISchemaType } from "..";

export type TypedCairoEnum<T> = CairoCustomEnum & {
    variant: { [K in keyof T]: T[K] | undefined };
    unwrap(): T[keyof T];
};

// Type definition for `onchain_dash::models::CallerCounter` struct
export type CallerCounter = {
    caller: string;
    counter: BigNumberish;
    timestamp: CairoOption<BigNumberish>;
};

// Type definition for `onchain_dash::models::CallerCounterValue` struct
export type CallerCounterValue = {
    counter: BigNumberish;
    timestamp: CairoOption<BigNumberish>;
};

// Type definition for `onchain_dash::models::CustomTheme` struct
export type CustomTheme = {
    classname: BigNumberish;
};

// Type definition for `onchain_dash::models::GlobalCounter` struct
export type GlobalCounter = {
    global_counter_key: BigNumberish;
    counter: BigNumberish;
};

// Type definition for `onchain_dash::models::GlobalCounterValue` struct
export type GlobalCounterValue = {
    counter: BigNumberish;
};

// Type definition for `onchain_dash::models::Message` struct
export type Message = {
    identity: string;
    content: string;
    timestamp: BigNumberish;
};

// Type definition for `onchain_dash::models::MessageValue` struct
export type MessageValue = {
    content: string;
};

// Type definition for `onchain_dash::models::Theme` struct
export type Theme = {
    theme_key: BigNumberish;
    value: DashboardThemeEnum;
    caller: string;
    timestamp: BigNumberish;
};

// Type definition for `onchain_dash::models::ThemeValue` struct
export type ThemeValue = {
    value: DashboardThemeEnum;
    caller: string;
    timestamp: BigNumberish;
};

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

export type SchemaType = ISchemaType & {
    onchain_dash: {
        CallerCounter: CallerCounter;
        CallerCounterValue: CallerCounterValue;
        CustomTheme: CustomTheme;
        GlobalCounter: GlobalCounter;
        GlobalCounterValue: GlobalCounterValue;
        Message: Message;
        MessageValue: MessageValue;
        Theme: Theme;
        ThemeValue: ThemeValue;
    };
};
export const schema: SchemaType = {
    onchain_dash: {
        CallerCounter: {
            caller: "",
            counter: 0,
            timestamp: new CairoOption(CairoOptionVariant.None),
        },
        CallerCounterValue: {
            counter: 0,
            timestamp: new CairoOption(CairoOptionVariant.None),
        },
        CustomTheme: {
            classname: 0,
        },
        GlobalCounter: {
            global_counter_key: 0,
            counter: 0,
        },
        GlobalCounterValue: {
            counter: 0,
        },
        Message: {
            identity: "",
            content: "",
            timestamp: 0,
        },
        MessageValue: {
            content: "",
        },
        Theme: {
            theme_key: 0,
            value: new CairoCustomEnum({
                Predefined: AvailableTheme.Light,
                custom: undefined,
            }),
            caller: "",
            timestamp: 0,
        },
        ThemeValue: {
            value: new CairoCustomEnum({
                Predefined: AvailableTheme.Light,
                custom: undefined,
            }),
            caller: "",
            timestamp: 0,
        },
    },
};
