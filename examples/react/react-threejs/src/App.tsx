import { ThreeGrid } from "./ui/components/Three";
import "./App.css";
import { useMemo } from "react";
import { KeyboardControlsEntry, KeyboardControls } from "@react-three/drei";
import { UIContainer } from "./ui/components/UIContainer";

export enum Controls {
  clockwise = "clockwise",
  counterClockwise = "counterClockwise",
}

function App() {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.clockwise, keys: ["KeyW"] },
      { name: Controls.counterClockwise, keys: ["KeyQ"] },
    ],
    []
  );
  return (
    <div className="relative w-screen h-screen flex flex-col">
      <main className="flex flex-col left-0 relative top-0 overflow-hidden grow">
        <div>
          <UIContainer />
        </div>
        <div
          id="canvas-container"
          className="z-10 left-0 relative top-0 overflow-hidden grow"
        >
          <KeyboardControls map={map}>
            <ThreeGrid />
          </KeyboardControls>
        </div>
      </main>
    </div>
  );
}

export default App;
