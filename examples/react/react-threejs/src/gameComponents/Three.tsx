import { Canvas, useThree } from "@react-three/fiber";

import { Stage, OrbitControls } from "@react-three/drei";
import { TileGrid } from "./TileGrid";
import { Players } from "./Players";
import { useEffect } from "react";
import { Vector3 } from "three";

interface CameraAdjusterProps {
    position: Vector3;
}

const CameraAdjuster = ({ position }: CameraAdjusterProps) => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(position.x, position.y, position.z);
        camera.updateProjectionMatrix();
    }, [position, camera]);

    return null;
};

export const ThreeGrid = () => {
    const initialCameraPosition = new Vector3(0, 100.0, 100); // Desired initial position

    return (
        <Canvas shadows>
            <CameraAdjuster position={initialCameraPosition} />
            <Stage shadows="contact" adjustCamera={false}>
                <OrbitControls makeDefault />
                <ambientLight />
                <directionalLight
                    castShadow
                    position={[213.3, 80.0, 264.4]}
                    shadow-camera-left={-100}
                    shadow-camera-right={100}
                    shadow-camera-top={100}
                    shadow-camera-bottom={-100}
                    shadow-camera-near={0.5}
                    shadow-camera-far={500}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <TileGrid rows={30} cols={30} />
                <Players />
            </Stage>
        </Canvas>
    );
};
