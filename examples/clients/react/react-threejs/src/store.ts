import { create } from "zustand";

export type Store = {
    players: any; // { [id]: { player, vec }, [id2]: { player, vec } }
    update_player: (player: any) => void;
};

export const useElementStore = create<Store>((set) => ({
    players: {},
    update_player: (player: any) =>
        set((state) => {
            return {
                players: {
                    ...state.players,
                    [player.player]: player,
                },
            };
        }),
}));
