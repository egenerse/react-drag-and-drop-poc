import React, { useState } from "react";
import { CanvasElement as CanvasElementType } from "../types";
import { useMovable } from "../hooks";
import "./CanvasElement.css";

type CanvasElementProps = {
  element: CanvasElementType;
};

const CanvasElement: React.FC<CanvasElementProps> = ({ element }) => {
  const [selected, setSelected] = useState(false);
  const { id, type, position, dimensions, features } = element;

  // Movable functionality
  const { position: movablePosition, handlePointerDown } =
    useMovable(id, position, Boolean(selected && features.movable));


  const portPositions = {
    top: { top: -5, left: dimensions.width / 2 - 5 },
    right: { top: dimensions.height / 2 - 5, left: dimensions.width - 5 },
    bottom: { top: dimensions.height - 5, left: dimensions.width / 2 - 5 },
    left: { top: dimensions.height / 2 - 5, left: -5 },
  };

  const handleSelect = () => setSelected((prev) => !prev); // Toggle selection on click

  return (
    <div
      className="canvas-element"
      style={{
        position: "absolute",
        left: movablePosition.x,
        top: movablePosition.y,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: selected ? "#388e3c" : "#4caf50", // Different color when selected
        cursor: selected && features.movable ? "move" : "default",
      }}

      onPointerDown={(e) => {
        handleSelect();
        handlePointerDown(e);
      }} // Drag handling only when selected
    >
      {type}

      {/* Render connection ports conditionally */}
      {selected && features.connectable && (
        <>
          {Object.entries(portPositions).map(([position, style]) => (
            <div
              key={position}
              className="port"
              style={style}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CanvasElement;
