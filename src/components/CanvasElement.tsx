import React, { RefObject, useEffect, useState } from "react";
import { CanvasElement as CanvasElementType } from "../types";
import { useMovable } from "../hooks";
import "./CanvasElement.css";
import { removeElementById } from "../store/canvasSlice";
import { useAppDispatch } from "../store/hooks";

type CanvasElementProps = {
  element: CanvasElementType;
  onMove: (x: number, y: number) => void; // Callback for movement
  canvasRef: RefObject<SVGSVGElement>; // Accept the ref as a parameter
};

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  onMove,
  canvasRef,
}) => {
  const [selected, setSelected] = useState(false);
  const { id, type, position, dimensions, features } = element;
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(removeElementById(id));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected && e.key === "Backspace") {
        e.preventDefault(); // Prevent default browser behavior
        handleDelete();
      }
    };

    // Attach the event listener when the element is selected
    if (selected) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Remove the event listener when the component unmounts or deselects
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDelete, selected]);

  // Movable functionality
  const { position: movablePosition, handlePointerDown } = useMovable(
    id,
    position,
    Boolean(selected && features.movable),
    canvasRef
  );

  useEffect(() => {
    onMove(position.x, position.y);
  }, [position, onMove]);

  const handleSelect = () => setSelected((prev) => !prev); // Toggle selection on click

  return (
    <>
      {type === "box" && (
        <rect
          x={movablePosition.x}
          y={movablePosition.y}
          width={dimensions.width}
          height={dimensions.height}
          fill={selected ? "#388e3c" : "#4caf50"}
          cursor={selected && features.movable ? "move" : "default"}
          onPointerDown={(e) => {
            handleSelect();
            handlePointerDown(e);
          }}
        />
      )}

      {type === "triangle" && (
        <polygon
          points={`${movablePosition.x},${movablePosition.y} ${
            movablePosition.x + dimensions.width / 2
          },${movablePosition.y + dimensions.height} ${
            movablePosition.x - dimensions.width / 2
          },${movablePosition.y + dimensions.height}`}
          fill="#f44336"
          cursor={selected && features.movable ? "move" : "default"}
          onPointerDown={(e) => {
            handleSelect();
            handlePointerDown(e);
          }}
        />
      )}
      {type === "circle" && (
        <circle
          cx={movablePosition.x}
          cy={movablePosition.y}
          r={dimensions.width / 2} // The radius is half the width to match the size logic
          fill="#4caf50" // Set your color here
          cursor={selected && features.movable ? "move" : "default"}
          onPointerDown={(e) => {
            handleSelect();
            handlePointerDown(e);
          }}
        />
      )}
    </>
  );
};

export default CanvasElement;
