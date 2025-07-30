import type { PropsWithChildren } from "react";

interface AlertProps {
    variant: string;
}

export const Alert = ({ children, variant }: PropsWithChildren<AlertProps>) => {
    const classes =
        variant === "destructive"
            ? "bg-red-900/50 text-red-200 border border-red-800/50 rounded-lg p-4"
            : "bg-zinc-800 border rounded-lg p-4";

    return <div className={classes}>{children}</div>;
};
