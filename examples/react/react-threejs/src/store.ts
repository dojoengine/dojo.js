import { create } from "zustand";

export type Store = {
    players: any; // { [id]: { player, vec }, [id2]: { player, vec } }
    set_players: (newPlayers: any) => void;
};

export const useElementStore = create<Store>((set) => ({
    players: {},
    set_players: (newPlayers: any) => set(() => ({ players: newPlayers })),
}));
