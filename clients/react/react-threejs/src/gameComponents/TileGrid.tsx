import { MAP_SCALE } from "@/config";

import { Tile } from "./Tile";

export const TileGrid = ({ rows, cols }: any) => {
    const squares = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * MAP_SCALE;
            const y = row * MAP_SCALE;

            squares.push(
                <Tile
                    key={`${row}-${col}`}
                    position={{ x, y }}
                    col={col}
                    row={row}
                />
            );
        }
    }
    return <>{squares}</>;
};
