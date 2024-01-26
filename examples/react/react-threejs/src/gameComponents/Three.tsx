import { Canvas } from "@react-three/fiber";

import { Stage, OrbitControls } from "@react-three/drei";
import { TileGrid } from "./TileGrid";
import { Players } from "./Players";

export const ThreeGrid = () => {
  return (
    <Canvas shadows>
      <Stage shadows="contact">
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
