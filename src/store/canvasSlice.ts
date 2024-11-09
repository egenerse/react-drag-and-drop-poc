import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

type CanvasElement = {
  id: string;
  type: string;
  x: number;
  y: number;
};

type Path = {
  id: string;
  startElementId: string;
  startPort: string;
  endElementId: string;
  endPort: string;
};

interface CanvasState {
  elements: CanvasElement[];
  paths: Path[];
  currentConnection: { startElementId: string; startPort: string } | null;
  tempConnection: { x: number; y: number } | null;
}

const initialState: CanvasState = {
  elements: [],
  paths: [],
  currentConnection: null,
  tempConnection: null,
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<{ type: string; x: number; y: number }>) => {
      const newElement = {
        id: uuidv4(),
        type: action.payload.type,
        x: action.payload.x,
        y: action.payload.y,
      };
      state.elements.push(newElement);
    },
    updateElementPosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
        const element = state.elements.find((el) => el.id === action.payload.id);
        if (element) {
          element.x = action.payload.x;
          element.y = action.payload.y;
        }
      },
    startConnection: (state, action: PayloadAction<{ elementId: string; port: string }>) => {
      state.currentConnection = { startElementId: action.payload.elementId, startPort: action.payload.port };
      state.tempConnection = null;
    },
    completeConnection: (state, action: PayloadAction<{ elementId: string; port: string }>) => {
      if (state.currentConnection) {
        const newPath = {
          id: uuidv4(),
          startElementId: state.currentConnection.startElementId,
          startPort: state.currentConnection.startPort,
          endElementId: action.payload.elementId,
          endPort: action.payload.port,
        };
        state.paths.push(newPath);
        state.currentConnection = null;
        state.tempConnection = null;
      }
    },
    cancelConnection: (state) => {
      state.currentConnection = null;
      state.tempConnection = null;
    },
    updateTempConnection: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.tempConnection = { x: action.payload.x, y: action.payload.y };
    },
  },
});

export const { addElement, startConnection, completeConnection, cancelConnection, updateTempConnection ,updateElementPosition} =
  canvasSlice.actions;
export default canvasSlice.reducer;
