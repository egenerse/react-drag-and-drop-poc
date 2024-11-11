// src/components/Canvas.tsx
import React from "react";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import CanvasElement from "./CanvasElement";
import { addElement } from "../store/canvasSlice";
import { ElementType } from "../types";
import CanvasRelationship from "./CanvasRelationship";

const Canvas: React.FC = () => {
  const elements = useAppSelector((state: RootState) => state.canvas.elements);
  const connections = useAppSelector(
    (state: RootState) => state.connections.connections
  );
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
      <div className="canvas">
        {elements.map((element) => (
          <CanvasElement key={element.id} element={element} />
        ))}
        {relationships.map((relationship) => (
          <CanvasRelationship
            key={relationship.id}
            relationshipId={relationship.id}
          />
        ))}

        {/* Render Ghost Line */}
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
