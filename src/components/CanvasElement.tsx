import React, { useEffect, useState } from "react";
import { CanvasElement as CanvasElementType } from "../types";
import { useMovable } from "../hooks";
import "./CanvasElement.css";
import { removeElementById } from "../store/canvasSlice";
import { useAppDispatch } from "../store/hooks";

type CanvasElementProps = {
  element: CanvasElementType;
  onMove: (x: number, y: number) => void;
};

const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  onMove,
}) => {
  const [selected, setSelected] = useState(false);
  const { id, type, position, dimensions, features } = element;
  const dispatch = useAppDispatch();

  // Movable functionality
  const { position: movablePosition, handlePointerDown } = useMovable(
    id,
    position,
    Boolean(selected && features.movable) // Enable movement only if selected
  );

  const handleDelete = React.useCallback(() => {
    dispatch(removeElementById(id));
  }, [dispatch, id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selected && e.key === "Backspace") {
        e.preventDefault(); // Prevent default browser behavior
        handleDelete();
      }
    };

    if (selected) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDelete, selected]);

  useEffect(() => {
    onMove(position.x, position.y);
  }, [position, onMove]);

  const handleSelect = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent other events from triggering
    setSelected((prev) => !prev); // Toggle selection on click
  };

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
            handleSelect(e);
            if (selected) handlePointerDown(e); // Only make movable if selected
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
            handleSelect(e);
            if (selected) handlePointerDown(e); // Only make movable if selected
          }}
        />
      )}
      {type === "circle" && (
        <circle
          cx={movablePosition.x}
          cy={movablePosition.y}
          r={dimensions.width / 2}
          fill="#4caf50"
          cursor={selected && features.movable ? "move" : "default"}
          onPointerDown={(e) => {
            handleSelect(e);
            if (selected) handlePointerDown(e); // Only make movable if selected
          }}
        />
      )}
    </>
  );
};

export default CanvasElement;
