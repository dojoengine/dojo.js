import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { Link } from "@tanstack/react-router";
import { Wallet } from "./wallet-provider";

export function Header() {
    const { setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 flex">
                    <a className="mr-6 flex items-center space-x-2" href="/">
                        <span className="font-bold inline-block">
                            Torii SQL
                        </span>
                    </a>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center gap-2">
                        <Button variant="link">
                            <Link
                                to="/documentation"
                                className="[&.active]:font-bold"
                            >
                                Documentation
                            </Link>
                        </Button>
                        <Button variant="link">
                            <Link
                                to="/playground"
                                className="[&.active]:font-bold"
                            >
                                Playground
                            </Link>
                        </Button>
                        <Wallet />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">
                                        Toggle theme
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setTheme("light")}
                                >
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme("dark")}
                                >
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme("system")}
                                >
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>
            </div>
        </header>
    );
}
