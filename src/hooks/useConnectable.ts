import { useAppDispatch } from "../store/hooks";
import { startConnection, updateTempPath, completeConnection, cancelConnection } from "../store/connectionsSlice";

export const useConnectable = (id: string) => {
  const dispatch = useAppDispatch();

  const handlePortMouseDown = (port: string) => {
    dispatch(startConnection({ sourceElementId: id, sourcePort: port }));
  };

  const handlePortMouseMove = (x: number, y: number) => {
    dispatch(updateTempPath({ x, y }));
  };

  const handlePortMouseUp = (targetId: string, port: string) => {
    dispatch(completeConnection({ targetElementId: targetId, targetPort: port }));
  };

  const cancelConnectionHandler = () => {
    dispatch(cancelConnection());
  };

  return { handlePortMouseDown, handlePortMouseMove, handlePortMouseUp, cancelConnectionHandler };
};
