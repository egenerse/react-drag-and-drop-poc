import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { addElement } from "../store/canvasSlice";

const Canvas: React.FC = () => {
  const dispatch = useDispatch();
  const elements = useSelector((state: RootState) => state.canvas.elements);

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

  return (
    <div className="canvas" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      {elements.map((el) => (
        <div
          key={el.id}
          className={`canvas-item ${el.type}`}
          style={{ left: el.x, top: el.y }}
        />
      ))}
    </div>
  );
};

export default Canvas;
