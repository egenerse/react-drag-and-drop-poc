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
  const dispatch = useAppDispatch();

  const elements = useAppSelector((state: RootState) => state.canvas.elements);
  const tempPath = useAppSelector(
    (state: RootState) => state.connections.tempPath
  );
  const currentConnection = useAppSelector(
    (state: RootState) => state.connections.currentConnection
  );
  const relationships = useAppSelector(
    (state: RootState) => state.relationships.relationships
  );

  // Function to expand canvas if an element is placed near the edge
  const expandCanvasIfNeeded = (x: number, y: number) => {
    const padding = 100;
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

  const handleElementMove = (x: number, y: number) => {
    expandCanvasIfNeeded(x, y);
  };

  // Handles drop event for mouse dragging
  const handleDrop = (e: React.DragEvent) => {
    console.log("DEBUG handle dropppppp")
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

  // Handles custom touch drop event
  const handleCustomDrop = React.useCallback(
    (e: CustomEvent) => {
      if (!canvasRef.current) return;

      const elementType = e.detail.type as ElementType;

      if (elementType) {
        console.log("debug handleCustomDrop  elementType", elementType);
        const rect = canvasRef.current.getBoundingClientRect();
        console.log("DEBUG handleCustom drop ,")
        const x = e.detail.x - rect.left;
        const y = e.detail.y - rect.top;

        console.log("debug handleCustomDrop  x", x, "y,", y);

        if (!!x && !!y) {
          dispatch(
            addElement({
              type: elementType,
              position: { x, y },
              dimensions: { width: 100, height: 100 },
              features: { movable: true, connectable: true },
            })
          );
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    // Adjust canvas size based on canvasSize state
    if (canvas) {
      canvas.style.width = `${canvasSize.width}px`;
      canvas.style.height = `${canvasSize.height}px`;
    }

    // Listen for custom drop event for touch
    document.addEventListener("drop", handleCustomDrop as EventListener);

    return () => {
      // Cleanup custom drop listener
      document.removeEventListener("drop", handleCustomDrop as EventListener);
    };
  }, [canvasSize, handleCustomDrop]);

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
