import type { Pagination as ToriiPagination } from "@dojoengine/torii-wasm";

export interface AggregationQueryInput {
    aggregatorIds?: string[];
    entityIds?: string[];
    pagination?: ToriiPagination;
}

export interface AggregationEntryView {
    id: string;
    aggregatorId: string;
    entityId: string;
    value: string;
    displayValue: string;
    position: number;
    modelId: string;
    createdAt: number;
    updatedAt: number;
}

export interface AggregationsPage {
    items: AggregationEntryView[];
    nextCursor?: string;
    next_cursor?: string;
}

export interface ActivityQueryInput {
    worldAddresses?: string[];
    namespaces?: string[];
    callerAddresses?: string[];
    fromTime?: number | string;
    toTime?: number | string;
    pagination?: ToriiPagination;
}

export interface ActivitySubscriptionQuery {
    worldAddresses?: string[];
    namespaces?: string[];
    callerAddresses?: string[];
}

export interface ActivityEntry {
    id: string;
    worldAddress: string;
    namespace: string;
    callerAddress: string;
    sessionStart: number;
    sessionEnd: number;
    actionCount: number;
    actions: Record<string, number>;
    updatedAt: number;
}

export interface ActivitiesPage {
    items: ActivityEntry[];
    nextCursor?: string;
    next_cursor?: string;
}

export interface AchievementQueryInput {
    worldAddresses?: string[];
    namespaces?: string[];
    hidden?: boolean;
    pagination?: ToriiPagination;
}

export interface PlayerAchievementQueryInput {
    worldAddresses?: string[];
    namespaces?: string[];
    playerAddresses?: string[];
    pagination?: ToriiPagination;
}

export type PlayerAchievementEntryView = PlayerAchievementEntryData;

export interface AchievementsPage {
    items: AchievementData[];
    nextCursor?: string;
    next_cursor?: string;
}

export interface PlayerAchievementsPage {
    items: PlayerAchievementEntryView[];
    nextCursor?: string;
    next_cursor?: string;
}

export interface AchievementProgressionView {
    id: string;
    achievementId: string;
    taskId: string;
    worldAddress: string;
    namespace: string;
    playerId: string;
    count: number;
    completed: boolean;
    completedAt?: number;
    createdAt: number;
    updatedAt: number;
}

export interface AchievementProgressionSubscriptionQuery {
    worldAddresses?: string[];
    namespaces?: string[];
    playerAddresses?: string[];
    achievementIds?: string[];
}

export type SqlIntegerValue = bigint | string;
export type SqlQueryScalar = string | number | SqlIntegerValue | null;

export type SqlQueryRow = Record<string, SqlQueryScalar>;
export type SqlQueryResponse = SqlQueryRow[];

export interface AchievementTaskData {
    task_id: string;
    description: string;
    total: number;
    total_completions: number;
    completion_rate: number;
    created_at: number;
}

export interface AchievementData {
    id: string;
    world_address: string;
    namespace: string;
    entity_id: string;
    hidden: boolean;
    index: number;
    points: number;
    start: string;
    end: string;
    group: string;
    icon: string;
    title: string;
    description: string;
    tasks: AchievementTaskData[];
    data: string;
    total_completions: number;
    completion_rate: number;
    created_at: number;
    updated_at: number;
}

export interface TaskProgressData {
    task_id: string;
    count: number;
    completed: boolean;
}

export interface PlayerAchievementStatsData {
    total_points: number;
    completed_achievements: number;
    total_achievements: number;
    completion_percentage: number;
    last_achievement_at?: number;
    created_at: number;
    updated_at: number;
}

export interface PlayerAchievementProgressData {
    achievement: AchievementData;
    task_progress: TaskProgressData[];
    completed: boolean;
    progress_percentage: number;
}

export interface PlayerAchievementEntryData {
    player_address: string;
    stats: PlayerAchievementStatsData;
    achievements: PlayerAchievementProgressData[];
}
