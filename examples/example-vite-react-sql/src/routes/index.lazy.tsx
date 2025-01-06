import { createLazyFileRoute } from "@tanstack/react-router";
import { Playground } from "@/components/playground/playground";

export const Route = createLazyFileRoute("/")({
    component: Playground,
});
