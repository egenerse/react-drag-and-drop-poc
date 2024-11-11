import React, { useRef } from "react";
import { ElementType } from "../types"; // Ensure this path is correct
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false); // Ref to track dragging status
  const dragTypeRef = useRef<ElementType | null>(null); // Ref to track element type

  const handleMouseDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    type: ElementType
  ) => {
    e.dataTransfer.setData("application/reactflow", type);
    draggingRef.current = true;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, type: ElementType) => {
    e.preventDefault();
    draggingRef.current = false; // Reset dragging status on new touch start
    dragTypeRef.current = type; // Set the current type

    // Add touchmove and touchend listeners
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    draggingRef.current = true; // Set dragging to true on touch move
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();

    if (draggingRef.current && dragTypeRef.current) {
      const sidebarWidth = sidebarRef.current?.offsetWidth || 0;
      const touch = e.changedTouches[0];
      const x = touch.clientX - sidebarWidth;
      const y = touch.clientY;

      // Dispatch custom drop event only if dragging occurred
      const touchEvent = new CustomEvent("drop", {
        detail: {
          type: dragTypeRef.current,
          x,
          y,
        },
      });
      document.dispatchEvent(touchEvent);
    }

    // Clean up listeners and reset refs
    draggingRef.current = false;
    dragTypeRef.current = null;
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  return (
    <div className="sidebar" ref={sidebarRef}>
      <h3>Elements</h3>
      <div
        draggable
        onTouchStart={(e) => handleTouchStart(e, ElementType.Box)}
        onDragStart={(e) => handleMouseDragStart(e, ElementType.Box)}
        className="sidebar-item box"
      >
        Box
      </div>
      <div
        draggable
        onTouchStart={(e) => handleTouchStart(e, ElementType.Triangle)}
        onDragStart={(e) => handleMouseDragStart(e, ElementType.Triangle)}
        className="sidebar-item triangle"
      >
        Triangle
      </div>
      <div
        draggable
        onTouchStart={(e) => handleTouchStart(e, ElementType.Circle)}
        onDragStart={(e) => handleMouseDragStart(e, ElementType.Circle)}
        className="sidebar-item circle"
      >
        Circle
      </div>
    </div>
  );
};

export default Sidebar;
