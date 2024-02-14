/** Signature of a logging function */
export interface LogFn {
    (message?: any, ...optionalParams: any[]): void;
}

/** Basic logger interface */
export interface Logger {
    info: LogFn;
    warn: LogFn;
    error: LogFn;
}

/** Log levels */
export type LogLevel = "info" | "warn" | "error" | "none";

/* tslint:disable:no-unused-variable */
const NO_OP: LogFn = (_message?: any, ..._optionalParams: any[]) => {};

/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
    readonly info: LogFn;
    readonly warn: LogFn;
    readonly error: LogFn;

    constructor(options?: { level?: LogLevel }) {
        const { level } = options || {};

        this.error = console.error.bind(console);

        if (level === "none") {
            this.error = NO_OP;
            this.warn = NO_OP;
            this.info = NO_OP;
        }

        if (level === "error") {
            this.warn = NO_OP;
            this.info = NO_OP;

            return;
        }

        this.warn = console.warn.bind(console);

        if (level === "warn") {
            this.info = NO_OP;

            return;
        }

        this.info = console.log.bind(console);
    }
}
