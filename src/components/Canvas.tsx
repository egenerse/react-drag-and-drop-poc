import React, { useEffect, useRef, useState } from "react";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import CanvasElement from "./CanvasElement";
import { addElement } from "../store/canvasSlice";
import { ElementType } from "../types";
import CanvasRelationship from "./CanvasRelationship";
import "./Canvas.css";

const Canvas: React.FC = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 1000 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Function to check element positions and expand canvas if necessary
  const expandCanvasIfNeeded = (x: number, y: number) => {
    const padding = 100; // Distance from edge to trigger expansion
    const newWidth =
      x + padding > canvasSize.width
        ? canvasSize.width + 500
        : canvasSize.width;
    const newHeight =
      y + padding > canvasSize.height
        ? canvasSize.height + 500
        : canvasSize.height;
    if (newWidth !== canvasSize.width || newHeight !== canvasSize.height) {
      setCanvasSize({ width: newWidth, height: newHeight });
    }
  };

  const elements = useAppSelector((state: RootState) => state.canvas.elements);
  const tempPath = useAppSelector(
    (state: RootState) => state.connections.tempPath
  );
  const currentConnection = useAppSelector(
    (state: RootState) => state.connections.currentConnection
  );
  const dispatch = useAppDispatch();
  const relationships = useAppSelector(
    (state: RootState) => state.relationships.relationships
  );

  const handleElementMove = (x: number, y: number) => {
    expandCanvasIfNeeded(x, y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.width = `${canvasSize.width}px`;
      canvas.style.height = `${canvasSize.height}px`;
    }
  }, [canvasSize]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData(
      "application/reactflow"
    ) as ElementType;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (elementType) {
      dispatch(
        addElement({
          type: elementType,
          position: { x, y },
          dimensions: { width: 100, height: 100 },
          features: { movable: true, connectable: true },
        })
      );
    }
  };

  return (
    <div
      className="canvas-container"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()} // Required to allow dropping
    >
      <div ref={canvasRef} className="canvas">
        {elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            onMove={handleElementMove}
            canvasRef={canvasRef}
          />
        ))}
        {relationships.map((relationship) => (
          <CanvasRelationship
            key={relationship.id}
            relationshipId={relationship.id}
          />
        ))}

        {currentConnection && tempPath && (
          <line
            x1={
              elements.find(
                (el) => el.id === currentConnection.sourceElementId
              )!.position.x + 25
            }
            y1={
              elements.find(
                (el) => el.id === currentConnection.sourceElementId
              )!.position.y + 25
            }
            x2={tempPath.x}
            y2={tempPath.y}
            stroke="gray"
            strokeDasharray="4"
          />
        )}
      </div>
    </div>
  );
};

export default Canvas;
