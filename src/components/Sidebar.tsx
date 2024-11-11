import React from "react";
import { ElementType } from "../types";

const Sidebar: React.FC = () => {
  const handleDragStart = (
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
        onDragStart={(e) => handleDragStart(e, ElementType.Box)}
        className="sidebar-item box"
      >
        Box
      </div>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, ElementType.Triangle)}
        className="sidebar-item triangle"
      >
        Triangle
      </div>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, ElementType.Circle)}
        className="sidebar-item triangle"
      >
        Circle
      </div>
    </div>
  );
};

export default Sidebar;
