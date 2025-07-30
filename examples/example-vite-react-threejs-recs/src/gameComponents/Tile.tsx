import { useMemo } from "react";
import * as THREE from "three";
import { MAP_SCALE } from "@/config";

export const Tile = ({ position }: any) => {
    const squareGeometry = useMemo(
        () => new THREE.BoxGeometry(MAP_SCALE, MAP_SCALE, MAP_SCALE),
        [MAP_SCALE]
    );

    return (
        <>
            <mesh
                receiveShadow
                position={[position.x, -MAP_SCALE, position.y]}
                geometry={squareGeometry}
                material={
                    new THREE.MeshPhongMaterial({
                        color: "lightgrey",
                    })
                }
            ></mesh>
            <lineSegments
                geometry={new THREE.EdgesGeometry(squareGeometry)}
                material={
                    new THREE.LineBasicMaterial({
                        color: "black",
                        linewidth: 1,
                    })
                }
                position={[position.x, -MAP_SCALE + 0.01, position.y]}
            />
        </>
    );
};
