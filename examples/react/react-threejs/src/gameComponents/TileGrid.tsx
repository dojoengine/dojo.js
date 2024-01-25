import { Tile } from "./Tile";

export const TileGrid = ({ rows, cols, squareSize }: any) => {
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
        />
      );
    }
  }
  return <>{squares}</>;
};
