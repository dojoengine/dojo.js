import * as THREE from "three";
import { useMemo } from "react";

export const Tile = ({ position, size }: any) => {
    const squareGeometry = useMemo(
        () => new THREE.BoxGeometry(size, size, size),
        [size]
    );

    return (
        <>
            <mesh
                receiveShadow
                position={[position.x, -size, position.y]}
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
                position={[position.x, -size + 0.01, position.y]}
            />
        </>
    );
};
