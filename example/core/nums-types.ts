// ---------------------------------------------------------------------------
// Typed model shapes for the NUMS game (live Sepolia Torii instance).
//
// In your own project you would derive these from your compiled ABI:
//
//   import type { DojoStarterSchema } from "@showcase/dojo";
//   type Moves = DojoStarterSchema["dojo_starter"]["Moves"];
//
// See `core/types.ts` for the full ABI-derived type showcase.
// ---------------------------------------------------------------------------

/** Shape of a NUMS.Game model as returned by Torii. */
export interface NUMSGame {
    id: number;
    over: boolean;
    claimed: boolean;
    level: number;
    slot_count: number;
    slot_min: number;
    slot_max: number;
    number: number;
    next_number: number;
    tournament_id: number;
    selected_powers: number;
    available_powers: number;
    reward: number;
    score: number;
    slots: string;
}

/** View model combining entity identity with typed game data. */
export interface GameViewModel extends NUMSGame {
    entityId: string;
}
