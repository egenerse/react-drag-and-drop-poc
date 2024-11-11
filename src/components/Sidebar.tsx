// Sidebar.tsx
import React from "react";
import { ElementType } from "../types"; // Ensure this path is correct
import { useAppDispatch } from "../store/hooks";
import { addElement } from "../store/canvasSlice";

interface SidebarProps {
  startDragging: (
    type: ElementType,
    initialPosition: { x: number; y: number }
  ) => void;
  dragPosition: { x: number; y: number } | null;
  updatePosition: (position: { x: number; y: number }) => void;
  resetDragging: ()=>void
}

const Sidebar: React.FC<SidebarProps> = ({
  startDragging,
  dragPosition,
  updatePosition,
  resetDragging
}) => {
  const dispatch = useAppDispatch();
  const handleMouseDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    type: ElementType
  ) => {
    e.dataTransfer.setData("application/reactflow", type);
  };

  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    type: ElementType
  ) => {
    const touch = e.touches[0];
    if (touch) {
      startDragging(type, { x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    console.log("DEBUG e e,", e);

    if (dragPosition) {
      dispatch(
        addElement({
          type: ElementType.Box,
          position: { x: dragPosition.x, y: dragPosition?.y },
          dimensions: { width: 100, height: 100 },
          features: { movable: true, connectable: true },
        })
      );
    }
    resetDragging()
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    console.log("DEBUG ontouch move e,",e)
    console.log("DEBUG ontouch touch,",touch)
    if (touch) {
      updatePosition({ x: touch.pageX, y: touch.pageY });
    }
  };

  return (
    <div className="sidebar">
      <h3>Elements</h3>
      <div
        draggable
        onTouchMove={onTouchMove}
        onDragStart={(e) => handleMouseDragStart(e, ElementType.Box)}
        onTouchStart={(e) => handleTouchStart(e, ElementType.Box)}
        onTouchEnd={handleTouchEnd}
        className="sidebar-item box"
      >
        Box
      </div>
      <div
        draggable
        onDragStart={(e) => handleMouseDragStart(e, ElementType.Triangle)}
        onTouchStart={(e) => handleTouchStart(e, ElementType.Triangle)}
        className="sidebar-item triangle"
      >
        Triangle
      </div>
      <div
        draggable
        onDragStart={(e) => handleMouseDragStart(e, ElementType.Circle)}
        onTouchStart={(e) => handleTouchStart(e, ElementType.Circle)}
        className="sidebar-item circle"
      >
        Circle
      </div>
    </div>
  );
};

export default Sidebar;
