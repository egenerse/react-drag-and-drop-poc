import { useState, useEffect, useCallback, RefObject } from "react";
import { throttle } from "lodash";
import { useAppDispatch } from "../store/hooks";
import { updateElementPosition } from "../store/canvasSlice";

export const useMovable = (
  id: string,
  initialPosition: { x: number; y: number },
  enabled: boolean,
  canvasRef: RefObject<HTMLDivElement> // Accept the ref as a parameter
) => {
  const dispatch = useAppDispatch();
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const throttledUpdatePosition = throttle((x: number, y: number) => {
    dispatch(updateElementPosition({ id, x, y }));
  }, 50);

  const startDragging = (x: number, y: number) => {
    setIsDragging(true);
    setOffset({ x: x - position.x, y: y - position.y });
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    console.log("DEBUGUGUGUU handlePointerDown");

    if (!enabled) return;
    const x = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const y = "clientY" in e ? e.clientY : e.touches[0].clientY;
    startDragging(x, y);

    // Lock scroll on the canvas using the ref
    if (canvasRef.current) {
      canvasRef.current.style.touchAction = "none";
    }
  };

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        const x = "clientX" in e ? e.clientX : e.touches[0].clientX;
        const y = "clientY" in e ? e.clientY : e.touches[0].clientY;
        const adjustedX = x - offset.x;
        const adjustedY = y - offset.y;
        setPosition({ x: adjustedX, y: adjustedY });
        throttledUpdatePosition(adjustedX, adjustedY);
      }
    },
    [isDragging, offset, throttledUpdatePosition]
  );

  const handlePointerUp = () => {
    console.log("DEBUGUGUGUU handlePointerUp");
    setIsDragging(false);

    // Ensure canvas scroll is re-enabled if the hook is cleaned up
    if (canvasRef.current) {
      canvasRef.current.style.touchAction = "auto";
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchmove", handlePointerMove);
      window.addEventListener("touchend", handlePointerUp);
    }
    return () => {
      if (canvasRef.current) {
        canvasRef.current.style.touchAction = "auto";
      }

      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, canvasRef]);

  return { position, handlePointerDown };
};
