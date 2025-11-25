import {
    createRootRoute,
    createRoute,
    createRouter,
    Link,
    Outlet,
} from "@tanstack/react-router";
import { Home } from "./pages/Home";
import { Tokens } from "./pages/Tokens";
import { TokenBalances } from "./pages/TokenBalances";
import { Events } from "./pages/Events";

const rootRoute = createRootRoute({
    component: () => (
        <div>
            <nav>
                <Link to="/">Home</Link> | <Link to="/tokens">Tokens</Link> |{" "}
                <Link to="/token-balances">Token Balances</Link> |{" "}
                <Link to="/events">Events</Link>
            </nav>
            <hr />
            <Outlet />
        </div>
    ),
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Home,
});

const tokensRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/tokens",
    component: Tokens,
});

const tokenBalancesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/token-balances",
    component: TokenBalances,
});

const eventsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/events",
    component: Events,
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    tokensRoute,
    tokenBalancesRoute,
    eventsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
