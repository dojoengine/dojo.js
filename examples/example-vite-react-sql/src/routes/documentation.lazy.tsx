import { Documentation } from "@/components/Documentation";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/documentation")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <Documentation />
        </div>
    );
}
