import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import { Has } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "@/dojo/useDojo";
import { Tile } from "./Tile";
import { Direction } from "@/utils";

export const TileGrid = ({ rows, cols, squareSize }: any) => {
    const {
        account: { account },
        setup: {
            clientComponents: { Position },
            client: { actions },
        },
    } = useDojo();

    const localPlayer = useComponentValue(
        Position,
        getEntityIdFromKeys([BigInt(account.address)])
    );

    const handleTileClick = (col: number, row: number) => {
        if (!localPlayer) return;

        // Call actions.move contract method
        let direction;
        if (row === localPlayer.vec.x + 1 && col === localPlayer.vec.y) {
            direction = Direction.Right;
        } else if (row === localPlayer.vec.x - 1 && col === localPlayer.vec.y) {
            direction = Direction.Left;
        } else if (row === localPlayer.vec.x && col === localPlayer.vec.y + 1) {
            direction = Direction.Down;
        } else if (row === localPlayer.vec.x && col === localPlayer.vec.y - 1) {
            direction = Direction.Up;
        }
        if (!direction) return;
        actions.move({ account, direction });
    };

    // Get all players
    const playerEntities = useEntityQuery([Has(Position)]).map((id) =>
        useComponentValue(Position, id)
    );

    const squares = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * squareSize;
            const y = row * squareSize;

            squares.push(
                <Tile
                    key={`${row}-${col}`}
                    position={{ x, y }}
                    size={squareSize}
                    col={col}
                    row={row}
                    onTileClick={handleTileClick}
                    playerEntities={playerEntities}
                />
            );
        }
    }
    return <>{squares}</>;
};
