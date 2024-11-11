import React, { useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import { ElementType } from "./types";
import "./App.css";

const App: React.FC = () => {
  const [draggingElement, setDraggingElement] = useState<ElementType | null>(
    null
  );
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startDragging = (
    type: ElementType,
    initialPosition: { x: number; y: number }
  ) => {
    setDraggingElement(type);
    setDragPosition(initialPosition);
  };

  const updatePosition = (position: { x: number; y: number }) => {
    setDragPosition(position);
  };

  const resetDragging = ()=>{
    setDragPosition(null)
    setDraggingElement(null)
  }

  return (
    <div className="app">
      <div ref={sidebarRef} style={{ flex: 1 }}>
        <Sidebar startDragging={startDragging} dragPosition={dragPosition} updatePosition={updatePosition} resetDragging={resetDragging} />
      </div>
      <Canvas draggingElement={draggingElement} dragPosition={dragPosition} resetDragging={resetDragging}/>

      {draggingElement && dragPosition && (
        <div
          className="ghost-element"
          style={{
            position: "absolute",
            left: dragPosition.x,
            top: dragPosition.y,
            pointerEvents: "none",
          }}
        >
          {/* Render the ghost element here, possibly a visual indicator of draggingElement */}
        </div>
      )}
    </div>
  );
};

export default App;
