import { ThreeGrid } from "./gameComponents/Three";

import "./App.css";

import { UIContainer } from "./gameComponents/UIContainer";

function App() {
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
                    <ThreeGrid />
                </div>
            </main>
        </div>
    );
}

export default App;
