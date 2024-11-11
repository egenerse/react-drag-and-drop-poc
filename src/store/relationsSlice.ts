import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface PathPoint {
  x: number;
  y: number;
}

interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  path: PathPoint[]; // List of points for rendering the path
}

interface RelationshipsState {
  relationships: Relationship[];
}

const initialState: RelationshipsState = {
  relationships: [
    {
      id: uuidv4(),
      sourceId: "f39598cf-79ac-4e00-97c4-6d8e47400063",
      targetId: "4f228d74-97a3-41db-81b5-6a7ef0de3acc",
      path: [
        { x: 173.4375 +50, y: 349 + 50 -50 }, // Center of first element
        { x: 173.4375 + 50, y: 349 + 50 -50  - 35 }, // Center of first element
        { x: 173.4375 + 50 +122, y: 349 + 50 -50  - 35 }, // Center of first element
        { x: 300.4375 + 50, y: 246 + 50  -50}, // Center of second element
      ],
    },
  ],
};

interface AddRelationshipPayload {
  sourceId: string;
  targetId: string;
  path: PathPoint[];
}

const relationshipsSlice = createSlice({
  name: "relationships",
  initialState,
  reducers: {
    addRelationship: (state, action: PayloadAction<AddRelationshipPayload>) => {
      const newRelationship: Relationship = {
        id: uuidv4(),
        sourceId: action.payload.sourceId,
        targetId: action.payload.targetId,
        path: action.payload.path,
      };
      state.relationships.push(newRelationship);
    },
    updateRelationshipPath: (state, action: PayloadAction<{ id: string; path: PathPoint[] }>) => {
      const relationship = state.relationships.find((rel) => rel.id === action.payload.id);
      if (relationship) {
        relationship.path = action.payload.path;
      }
    },
  },
});

export const { addRelationship, updateRelationshipPath } = relationshipsSlice.actions;
export default relationshipsSlice.reducer;
