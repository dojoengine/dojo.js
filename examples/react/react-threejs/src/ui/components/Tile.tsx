import * as THREE from "three";
import { useMemo, useRef, useState, useEffect } from "react";
import { Cone } from "@react-three/drei";
import { useDojo } from "@/dojo/useDojo";

export const Tile = ({
  position,
  size,
  col,
  row,
  onTileClick,
  playerEntities,
}: any) => {
  const {
    account: { account },
  } = useDojo();

  const meshRef = useRef<any>();

  const squareGeometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);
  const [color, setColor] = useState<string | undefined>('grey');
  const [isNextToPlayer, setIsNextToPlayer] = useState(false);

  const handleMeshClick = () => {
    onTileClick(col, row);
  };

  useEffect(() => {
    if (!playerEntities) return;
    let color
    for (const player of playerEntities) {
      const isCurrentPlayer = account.address === '0x' + player.player.toString(16)

      // Player is green, other players are red, color undefined if no player
      if (row === player.vec.x && col == player.vec.y) {
        color = isCurrentPlayer ? 'green' : 'red'
      }

      // Check if the cell is next to the player, if yes, change the color
      const isCurrentPlayerNeighbor = isCurrentPlayer &&
        (row + 1 === player.vec.x && col == player.vec.y ||
          row - 1 === player.vec.x && col == player.vec.y ||
          row === player.vec.x && col == player.vec.y + 1 ||
          row === player.vec.x && col == player.vec.y - 1)
      setIsNextToPlayer(isCurrentPlayerNeighbor)
    }
    setColor(color)
  }, [playerEntities])

  return (
    <>
      <mesh
        receiveShadow
        onClick={handleMeshClick}
        ref={meshRef}
        position={[position.x, -size, position.y]}
        geometry={squareGeometry}
        material={
          new THREE.MeshPhongMaterial({ color: isNextToPlayer ? 'blue' : 'lightgrey' })
        }
      >
      </mesh>
      {color &&
        <Cone
          castShadow
          scale={[1, size, 1]}
          position={[position.x, 0, position.y]}
          material={
            new THREE.MeshPhongMaterial({ color })
          }
        />
      }
      <lineSegments
        geometry={new THREE.EdgesGeometry(squareGeometry)}
        material={
          new THREE.LineBasicMaterial({
            color: 'black',
            linewidth: 1,
          })
        }
        position={[position.x, -size + 0.01, position.y]}
      />
    </>
  );
};
