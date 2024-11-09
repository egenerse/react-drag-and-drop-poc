import React from "react";

const Sidebar: React.FC = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData("application/reactflow", type);
  };

  return (
    <div className="sidebar">
      <h3>Elements</h3>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, "box")}
        className="sidebar-item box"
      >
        Box
      </div>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, "triangle")}
        className="sidebar-item triangle"
      >
        Triangle
      </div>
    </div>
  );
};

export default Sidebar;
