// src/components/CanvasElement.tsx
import React, { useState } from "react";
import { CanvasElement as CanvasElementType } from "../types";
import { useMovable } from "../hooks/useMovable";
import { useConnectable } from "../hooks/useConnectable";
import "./CanvasElement.css";

type CanvasElementProps = {
  element: CanvasElementType;
};

const CanvasElement: React.FC<CanvasElementProps> = ({ element }) => {
  const { id, type, position, dimensions, features } = element;

  // Movable functionality
  const { position: movablePosition, handleMouseDown: handleElementMouseDown } =
    useMovable(id, position, features.movable || false);

  // Connectable functionality
  const { handlePortMouseDown, handlePortMouseMove, handlePortMouseUp } =
    useConnectable(id);

  // State to manage port visibility
  const [showPorts, setShowPorts] = useState(false);

  const portPositions = {
    top: { top: -5, left: dimensions.width / 2 - 5 },
    right: { top: dimensions.height / 2 - 5, left: dimensions.width - 5 },
    bottom: { top: dimensions.height - 5, left: dimensions.width / 2 - 5 },
    left: { top: dimensions.height / 2 - 5, left: -5 },
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!e.defaultPrevented) {
      handleElementMouseDown(e);
    }
  };
  return (
    <div
      className="canvas-element"
      style={{
        position: "absolute",
        left: movablePosition.x,
        top: movablePosition.y,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: "#4caf50",
        cursor: features.movable ? "move" : "default",
      }}
      onPointerDown={handleMouseDown} // Drag handling only on the element, not ports
      // onMouseDown={handleMouseDown} // Drag handling only on the element, not ports
      onMouseEnter={() => setShowPorts(true)}
      onMouseLeave={() => setShowPorts(false)}
    >
      {type}

      {/* Render connection ports conditionally */}
      {showPorts && features.connectable && (
        <>
          {Object.entries(portPositions).map(([position, style]) => (
            <div
              key={position}
              className="port"
              style={style}
              onMouseDown={(e) => {
                e.preventDefault();
                handlePortMouseDown(position);
                e.stopPropagation();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePortMouseUp(id, position);
              }}
            //   onPointer={(e) => {
            //     e.preventDefault();
            //     e.stopPropagation();
            //     handlePortMouseMove(e.clientX, e.clientY);
            //   }} // Update ghost line position
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CanvasElement;
