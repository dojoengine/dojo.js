import type { PropsWithChildren } from "react";

interface ButtonProps {
    onClick: (...args: any) => any;
    disabled?: boolean;
    variant?: string;
    className?: string;
}

export const Button = ({
    children,
    onClick,
    disabled = false,
    variant,
    className,
}: PropsWithChildren<ButtonProps>) => {
    const baseClasses =
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none px-4 py-2";
    const variantClasses =
        variant === "outline"
            ? "border border-zinc-700 hover:bg-zinc-800 text-white"
            : "bg-white text-black hover:bg-zinc-100";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses} ${className || ""}`}
        >
            {children}
        </button>
    );
};
