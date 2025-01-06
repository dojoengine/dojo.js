import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import StarknetProvider from "@/components/starknet-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <React.Fragment>
            <QueryClientProvider client={queryClient}>
                <StarknetProvider>
                    <ThemeProvider defaultTheme="system" enableSystem>
                        <div className="min-h-screen bg-background">
                            <Header />
                            <main className="container py-6 mx-auto my-0">
                                <Outlet />
                            </main>
                        </div>
                    </ThemeProvider>
                </StarknetProvider>
            </QueryClientProvider>
        </React.Fragment>
    );
}
