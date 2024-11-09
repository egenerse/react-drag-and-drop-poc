import React, { useState, useEffect, useCallback } from "react";
import { RootState } from "../store";
import { addElement, updateElementPosition } from "../store/canvasSlice";
import { throttle } from "lodash";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const throttledUpdatePosition = throttle((dispatch, id, x, y) => {
  dispatch(updateElementPosition({ id, x, y }));
}, 50);

const Canvas: React.FC = () => {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state: RootState) => state.canvas.elements);

  const [draggingElement, setDraggingElement] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/reactflow");
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (type) {
      dispatch(addElement({ type, x, y }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const element = elements.find((el) => el.id === id);
    if (element) {
      const offsetX = e.clientX - element.x;
      const offsetY = e.clientY - element.y;
      setDraggingElement({ id, offsetX, offsetY });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingElement) {
        const x = e.clientX - draggingElement.offsetX;
        const y = e.clientY - draggingElement.offsetY;
        throttledUpdatePosition(dispatch, draggingElement.id, x, y);
      }
    },
    [draggingElement, dispatch]
  );

  const handleMouseUp = () => {
    setDraggingElement(null);
  };

  useEffect(() => {
    if (draggingElement) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingElement, handleMouseMove]);

  return (
    <div
      className="canvas"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {elements.map((el) => (
        <div
          key={el.id}
          className={`canvas-item ${el.type}`}
          style={{ left: el.x, top: el.y, position: "absolute" }}
          onMouseDown={(e) => handleMouseDown(e, el.id)}
        >
          {el.type}
        </div>
      ))}
    </div>
  );
};

export default Canvas;
