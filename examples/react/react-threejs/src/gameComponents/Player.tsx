import * as THREE from "three";
import { useDojo } from "@/dojo/useDojo";
import { useComponentValue } from "@dojoengine/react";
import { Cone } from "@react-three/drei";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Direction } from "@/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MAP_SCALE } from "@/config";

export const Player = (props: any) => {
    const {
        account: { account },
        setup: {
            clientComponents: { Position },
            client: { actions },
        },
    } = useDojo();

    const [hoveredTile, setHoveredTile] = useState<Direction | undefined>(
        undefined
    );
    const [startPosition, setStartPosition] = useState<
        THREE.Vector3 | undefined
    >();
    const [targetPosition, setTargetPosition] = useState<
        THREE.Vector3 | undefined
    >();
    const [moving, setMoving] = useState<boolean>(false);

    // Retrieve player info
    const { player } = props;

    // Retrieve local player
    const localPlayer = useComponentValue(
        Position,
        getEntityIdFromKeys([BigInt(account.address)])
    );

    if (!localPlayer) {
        return;
    }

    const handleTileClick = (direction: Direction) => {
        actions.move({ account, direction });
    };

    const isLocalPlayer = localPlayer.player == player.player;

    const { vec, prevVec } = player;
    const color = isLocalPlayer ? "green" : "red";

    // Blue cell around player
    const squareGeometry = useMemo(
        () => new THREE.BoxGeometry(MAP_SCALE, MAP_SCALE, MAP_SCALE),
        [MAP_SCALE]
    );

    const blueCellsAroundPlayer = [
        {
            direction: Direction.Up,
            position: new THREE.Vector3(
                (vec.y - 1) * MAP_SCALE,
                -MAP_SCALE + 0.1,
                vec.x * MAP_SCALE
            ),
        },
        {
            direction: Direction.Down,
            position: new THREE.Vector3(
                (vec.y + 1) * MAP_SCALE,
                -MAP_SCALE + 0.1,
                vec.x * MAP_SCALE
            ),
        },
        {
            direction: Direction.Right,
            position: new THREE.Vector3(
                vec.y * MAP_SCALE,
                -MAP_SCALE + 0.1,
                (vec.x + 1) * MAP_SCALE
            ),
        },
        {
            direction: Direction.Left,
            position: new THREE.Vector3(
                vec.y * MAP_SCALE,
                -MAP_SCALE + 0.1,
                (vec.x - 1) * MAP_SCALE
            ),
        },
    ];
    // Progress ref
    const lerpProgress = useRef(0);
    const coneRef: any = useRef();

    // Lerp
    useFrame((_, delta) => {
        if (!startPosition || !targetPosition) return;
        if (lerpProgress.current < 1) {
            lerpProgress.current += delta * 4; // Adjust this value for speed

            if (coneRef.current) {
                coneRef.current.position.lerpVectors(
                    startPosition,
                    targetPosition,
                    lerpProgress.current
                );
            }
        } else if (lerpProgress.current >= 1 && moving) {
            coneRef.current.position.copy(targetPosition);
            setMoving(false);
        }
    });

    // When a new position is set, start lerp
    useEffect(() => {
        if (!coneRef.current || !coneRef.current.position) return;
        const newTargetPosition = new THREE.Vector3(
            vec.y * MAP_SCALE,
            0,
            vec.x * MAP_SCALE
        );
        if (player.prevVec === undefined) {
            // First time syncing the player, no prevVec registered
            coneRef.current.position.copy(newTargetPosition);
            setMoving(false);
            return;
        }

        // Start lerp between start and target position
        setStartPosition(
            new THREE.Vector3(prevVec.y * MAP_SCALE, 0, prevVec.x * MAP_SCALE)
        );
        setTargetPosition(newTargetPosition);
        lerpProgress.current = 0;

        // Reset Hovered Tile
        setMoving(true);
        setHoveredTile(undefined);
    }, [coneRef, player]);

    useEffect(() => {
        // Change cursor style if hovering a tile
        document.body.style.cursor = hoveredTile ? "pointer" : "default";
    }, [hoveredTile]);

    return (
        <>
            <Cone
                castShadow
                key="player"
                ref={coneRef}
                scale={[1, MAP_SCALE, 1]}
                material={new THREE.MeshPhongMaterial({ color })}
            />
            {
                // Add 4 cells around the local player
                !moving &&
                isLocalPlayer &&
                blueCellsAroundPlayer.map((cellInfo, k: number) => {
                    return (
                        <mesh
                            key={k}
                            receiveShadow
                            onClick={() =>
                                handleTileClick(cellInfo.direction)
                            }
                            position={cellInfo.position}
                            geometry={squareGeometry}
                            material={
                                new THREE.MeshPhongMaterial({
                                    color:
                                        hoveredTile === cellInfo.direction
                                            ? "lightblue"
                                            : "blue",
                                })
                            }
                            onPointerEnter={(e) => {
                                // Stop propagation to avoid selecting other cells
                                // onPointerEnter does not stop at the first cell encountered by default
                                e.stopPropagation();
                                setHoveredTile(cellInfo.direction);
                            }}
                            onPointerLeave={(e) => {
                                // Stop propagation to avoid selecting other cells
                                // onPointerLeave does not stop at the first cell encountered by default
                                e.stopPropagation();
                                setHoveredTile(undefined);
                            }}
                        ></mesh>
                    );
                })
            }
        </>
    );
};
