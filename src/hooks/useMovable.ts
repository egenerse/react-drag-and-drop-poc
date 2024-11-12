import { useState, useEffect, useCallback, useRef } from "react";
import { throttle } from "lodash";
import { useAppDispatch } from "../store/hooks";
import { updateElementPosition } from "../store/canvasSlice";

export const useMovable = (
  id: string,
  initialPosition: { x: number; y: number },
  enabled: boolean
) => {
  const dispatch = useAppDispatch();
  const [position, setPosition] = useState(initialPosition);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const isDragging = useRef(false);

  const throttledUpdatePosition = throttle((x: number, y: number) => {
    dispatch(updateElementPosition({ id, x, y }));
  }, 50);

  const startDragging = (x: number, y: number) => {
    isDragging.current = true;
    setOffset({ x: x - position.x, y: y - position.y });
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!enabled) return; // Only start dragging if enabled
    e.preventDefault();

    const x = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const y = "clientY" in e ? e.clientY : e.touches[0].clientY;
    startDragging(x, y);

    e.stopPropagation();
  };

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      e.preventDefault();
      const x = "clientX" in e ? e.clientX : e.touches[0].clientX;
      const y = "clientY" in e ? e.clientY : e.touches[0].clientY;
      const adjustedX = x - offset.x;
      const adjustedY = y - offset.y;

      setPosition({ x: adjustedX, y: adjustedY });
      throttledUpdatePosition(adjustedX, adjustedY);
      e.stopPropagation();
    },
    [offset, throttledUpdatePosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    if (isDragging.current) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchmove", handlePointerMove);
      window.addEventListener("touchend", handlePointerUp);
    }

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return { position, handlePointerDown };
};
