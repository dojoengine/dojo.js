import { useEffect, useMemo, useRef, useState } from "react";
import { MAP_SCALE } from "@/config";
import { useDojo } from "@/dojo/useDojo";
import { Direction } from "@/utils";
import { useComponentValue } from "@dojoengine/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { Cone } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Player = (props: any) => {
    const {
        account: { account },
        setup: {
            clientComponents: { Position },
            systemCalls: { move },
        },
    } = useDojo();

    const [hoveredTile, setHoveredTile] = useState<Direction | undefined>(
        undefined
    );
    const [startPosition, setStartPosition] = useState<
        THREE.Vector3 | undefined
    >();
    let targetPosition = useRef<THREE.Vector3 | undefined>();

    // Retrieve player info
    const { player } = props;

    // Retrieve local player
    const localPlayer = useComponentValue(
        Position,
        getEntityIdFromKeys([BigInt(account.address)])
    );

    const handleTileClick = (direction: Direction) => {
        move(account, direction);
    };

    const isLocalPlayer = localPlayer?.player == player.player;

    const { vec } = player;
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
        if (!startPosition || !targetPosition.current) return;
        if (lerpProgress.current < 1) {
            lerpProgress.current += delta * 4; // Adjust this value for speed

            if (coneRef.current) {
                coneRef.current.position.lerpVectors(
                    startPosition,
                    targetPosition.current,
                    lerpProgress.current
                );
            }
        } else if (lerpProgress.current >= 1) {
            coneRef.current.position.copy(targetPosition.current);
        }
    });

    // When a new position is set, start lerp
    useEffect(() => {
        // if (!coneRef.current || !coneRef.current.position) return;
        const newTargetPosition = new THREE.Vector3(
            vec.y * MAP_SCALE,
            0,
            vec.x * MAP_SCALE
        );

        // Check if there is an existing target position
        if (targetPosition.current) {
            // Set the start position to the current target position for the lerp
            setStartPosition(targetPosition.current);
        } else {
            // If it's the first time, just set the cone's position directly
            if (coneRef.current) {
                coneRef.current.position.copy(newTargetPosition);
            }
        }

        targetPosition.current = newTargetPosition;
        lerpProgress.current = 0;

        // Reset Hovered Tile
        setHoveredTile(undefined);
    }, [coneRef, player, vec.x, vec.y]);

    useEffect(() => {
        // Change cursor style if hovering a tile
        document.body.style.cursor = hoveredTile ? "pointer" : "default";
    }, [hoveredTile]);

    return (
        <>
            {/* @ts-ignore */}
            <Cone
                castShadow
                key="player"
                ref={coneRef}
                scale={[MAP_SCALE / 3, MAP_SCALE, MAP_SCALE / 3]}
                material={new THREE.MeshPhongMaterial({ color })}
            />
            {
                // Add 4 cells around the local player
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
