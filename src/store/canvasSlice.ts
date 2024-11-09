import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

type CanvasElement = {
  id: string;
  type: string;
  x: number;
  y: number;
};

interface CanvasState {
  elements: CanvasElement[];
}

const initialState: CanvasState = {
  elements: [],
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    addElement: (
      state,
      action: PayloadAction<{ type: string; x: number; y: number }>
    ) => {
      const newElement = {
        id: uuidv4(),
        type: action.payload.type,
        x: action.payload.x,
        y: action.payload.y,
      };
      state.elements.push(newElement);
    },
  },
});

export const { addElement } = canvasSlice.actions;
export default canvasSlice.reducer;
