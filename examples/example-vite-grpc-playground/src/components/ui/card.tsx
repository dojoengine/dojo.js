import type { PropsWithChildren } from "react";

interface CardProps {
    className: string;
}
export const Card = ({ children, className }: PropsWithChildren<CardProps>) => {
    return (
        <div
            className={`bg-zinc-900 rounded-lg border border-zinc-800 ${className || ""}`}
        >
            {children}
        </div>
    );
};
