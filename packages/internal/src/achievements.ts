import { addAddressPadding } from "starknet";
import { defaultToriiPagination } from "./pagination";
import { safeCallback } from "./token";
import type { ToriiClient, Subscription } from "@dojoengine/torii-wasm/types";
import type {
    AchievementProgressionSubscriptionQuery,
    AchievementQueryInput,
    AchievementsPage,
    PlayerAchievementQueryInput,
    PlayerAchievementsPage,
    SubscribeAchievementProgressionRequest,
    UpdateAchievementProgressionSubscriptionRequest,
    AchievementProgressionData,
} from "./types";

function normalizeAddresses(addresses?: string[]): string[] {
    return (addresses ?? []).map((address) => addAddressPadding(address));
}

export const defaultAchievementProgression: AchievementProgressionData = {
    id: "",
    achievement_id: "",
    task_id: "",
    world_address: "0x0",
    namespace: "",
    player_id: "0x0",
    count: 0,
    completed: false,
    completed_at: undefined,
    created_at: 0,
    updated_at: 0,
};

function toAchievementsPage(page: any): AchievementsPage {
    return {
        items: page.items,
        nextCursor: page.next_cursor || undefined,
        next_cursor: page.next_cursor || undefined,
    };
}

function toPlayerAchievementsPage(page: any): PlayerAchievementsPage {
    return {
        items: page.items,
        nextCursor: page.next_cursor || undefined,
        next_cursor: page.next_cursor || undefined,
    };
}

function toAchievementQuery(input?: AchievementQueryInput) {
    return {
        world_addresses: normalizeAddresses(input?.worldAddresses),
        namespaces: input?.namespaces ?? [],
        hidden: input?.hidden,
        pagination: input?.pagination ?? defaultToriiPagination,
    };
}

function toPlayerAchievementQuery(input?: PlayerAchievementQueryInput) {
    return {
        world_addresses: normalizeAddresses(input?.worldAddresses),
        namespaces: input?.namespaces ?? [],
        player_addresses: normalizeAddresses(input?.playerAddresses),
        pagination: input?.pagination ?? defaultToriiPagination,
    };
}

function toProgressionFilters(
    filters: AchievementProgressionSubscriptionQuery
) {
    return {
        worldAddresses: normalizeAddresses(filters.worldAddresses),
        namespaces: filters.namespaces ?? [],
        playerAddresses: normalizeAddresses(filters.playerAddresses),
        achievementIds: filters.achievementIds ?? [],
    };
}

export async function getAchievements(
    client: ToriiClient,
    query?: AchievementQueryInput
): Promise<AchievementsPage> {
    const result = await (client as any).getAchievements(
        toAchievementQuery(query)
    );
    return toAchievementsPage(result);
}

export async function getPlayerAchievements(
    client: ToriiClient,
    query?: PlayerAchievementQueryInput
): Promise<PlayerAchievementsPage> {
    const result = await (client as any).getPlayerAchievements(
        toPlayerAchievementQuery(query)
    );
    return toPlayerAchievementsPage(result);
}

export async function onAchievementProgressionUpdated(
    client: ToriiClient,
    request: SubscribeAchievementProgressionRequest
): Promise<Subscription> {
    const { worldAddresses, namespaces, playerAddresses, achievementIds } =
        toProgressionFilters(request);

    return (client as any).onAchievementProgressionUpdated(
        worldAddresses.length ? worldAddresses : undefined,
        namespaces.length ? namespaces : undefined,
        playerAddresses.length ? playerAddresses : undefined,
        achievementIds.length ? achievementIds : undefined,
        safeCallback(request.callback, defaultAchievementProgression)
    );
}

export async function updateAchievementProgressionSubscription(
    client: ToriiClient,
    request: UpdateAchievementProgressionSubscriptionRequest
): Promise<void> {
    const { subscription, ...filters } = request;
    const { worldAddresses, namespaces, playerAddresses, achievementIds } =
        toProgressionFilters(filters);

    await (client as any).updateAchievementProgressionSubscription(
        subscription,
        worldAddresses,
        namespaces,
        playerAddresses,
        achievementIds
    );
}
