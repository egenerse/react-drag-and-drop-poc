import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import {
  CanvasElement,
  ElementType,
  Position,
  Dimensions,
  BaseElementFeatures,
} from "../types";

interface CanvasState {
  elements: CanvasElement[];
  pan: Position;
  zoom: number;
}

const initialState: CanvasState = {
  elements: [
    {
      id: "f39598cf-79ac-4e00-97c4-6d8e47400063",
      type: ElementType.Box,
      position: {
        x: 173.4375,
        y: 349,
      },
      dimensions: {
        width: 100,
        height: 100,
      },
      features: {
        movable: true,
        connectable: true,
      },
    },
    {
      id: "4f228d74-97a3-41db-81b5-6a7ef0de3acc",
      type: ElementType.Box,
      position: {
        x: 300.4375,
        y: 246,
      },
      dimensions: {
        width: 100,
        height: 100,
      },
      features: {
        movable: true,
        connectable: true,
      },
    },
  ],
  pan: { x: 0, y: 0 },
  zoom: 1,
};

// Define a payload type for adding a new element
interface AddElementPayload {
  type: ElementType;
  position: Position;
  dimensions: Dimensions;
  features: BaseElementFeatures;
}

// Define a payload type for updating the position of an element
interface UpdateElementPositionPayload {
  id: string;
  x: number;
  y: number;
}

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<AddElementPayload>) => {
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: action.payload.type,
        position: action.payload.position,
        dimensions: action.payload.dimensions,
        features: action.payload.features,
      };
      state.elements.push(newElement);
    },
    updateElementPosition: (
      state,
      action: PayloadAction<UpdateElementPositionPayload>
    ) => {
      const element = state.elements.find((el) => el.id === action.payload.id);
      if (element) {
        element.position.x = action.payload.x;
        element.position.y = action.payload.y;
      }
    },
    setPan: (state, action: PayloadAction<Position>) => {
      state.pan = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    removeElementById(state, action: PayloadAction<string>) {
      state.elements = state.elements.filter((el) => el.id !== action.payload);
    }
  },
});

export const { addElement, updateElementPosition, setPan, setZoom ,removeElementById} =
  canvasSlice.actions;
export default canvasSlice.reducer;
