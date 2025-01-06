import { Playground } from "@/components/playground/playground";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/playground")({
    component: Playground,
});
