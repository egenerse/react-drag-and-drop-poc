import { useState, useEffect, useCallback } from "react";
import { throttle } from "lodash";
import { useAppDispatch } from "../store/hooks";
import { updateElementPosition } from "../store/canvasSlice";

export const useMovable = (id: string, initialPosition: { x: number; y: number }, enabled: boolean) => {
  const dispatch = useAppDispatch();
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const throttledUpdatePosition = throttle((x: number, y: number) => {
    dispatch(updateElementPosition({ id, x, y }));
  }, 50);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enabled) return;
    setIsDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const x = e.clientX - offset.x;
        const y = e.clientY - offset.y;
        setPosition({ x, y });
        throttledUpdatePosition(x, y);
      }
    },
    [isDragging, offset, throttledUpdatePosition]
  );

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  return { position, handleMouseDown };
};
