import React from "react";
import { ElementType } from "../types"; // Ensure this path is correct
import "./Sidebar.css"

const Sidebar: React.FC = () => {
  const handleMouseDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    type: ElementType
  ) => {
    e.dataTransfer.setData("application/reactflow", type);
  };

  return (
    <div className="sidebar">
      <h3>Elements</h3>
      <div
        draggable
        onDragStart={(e) => handleMouseDragStart(e, ElementType.Box)}
        className="sidebar-item box"
      >
        Box
      </div>
      <div
        draggable
        onDragStart={(e) => handleMouseDragStart(e, ElementType.Triangle)}
        className="sidebar-item triangle"
      >
        Triangle
      </div>
      <div
        draggable
        onDragStart={(e) => handleMouseDragStart(e, ElementType.Circle)}
        className="sidebar-item circle"
      >
        Circle
      </div>
    </div>
  );
};

export default Sidebar;
