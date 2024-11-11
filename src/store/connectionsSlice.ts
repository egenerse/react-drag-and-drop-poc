// src/store/connectionsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface ConnectionPath {
  x: number;
  y: number;
}

interface Connection {
  id: string;
  sourceElementId: string;
  targetElementId: string;
  sourcePort: string;
  targetPort: string;
  path: ConnectionPath[]; // Used to display custom paths or curves if needed
}

interface ConnectionsState {
  connections: Connection[];
  currentConnection: { sourceElementId: string; sourcePort: string } | null;
  tempPath: ConnectionPath | null;
}

const initialState: ConnectionsState = {
  connections: [
    {
      id: '6cc75f21-0d7b-4876-9366-6ecb27c7a76f',
      sourceElementId: 'f39598cf-79ac-4e00-97c4-6d8e47400063',
      targetElementId: '4f228d74-97a3-41db-81b5-6a7ef0de3acc',
      sourcePort: 'right',
      targetPort: 'bottom',
      path: []
    },
  ],
  currentConnection: null,
  tempPath: null,
};

interface StartConnectionPayload {
  sourceElementId: string;
  sourcePort: string;
}

interface CompleteConnectionPayload {
  targetElementId: string;
  targetPort: string;
}

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    startConnection: (state, action: PayloadAction<StartConnectionPayload>) => {
      state.currentConnection = {
        sourceElementId: action.payload.sourceElementId,
        sourcePort: action.payload.sourcePort,
      };
      state.tempPath = null;
    },
    updateTempPath: (state, action: PayloadAction<ConnectionPath>) => {
      state.tempPath = action.payload;
    },
    completeConnection: (state, action: PayloadAction<CompleteConnectionPayload>) => {
      if (state.currentConnection) {
        const newConnection: Connection = {
          id: uuidv4(),
          sourceElementId: state.currentConnection.sourceElementId,
          targetElementId: action.payload.targetElementId,
          sourcePort: state.currentConnection.sourcePort,
          targetPort: action.payload.targetPort,
          path: [], // Customize with a specific path if needed
        };
        state.connections.push(newConnection);
        state.currentConnection = null;
        state.tempPath = null;
      }
    },
    cancelConnection: (state) => {
      state.currentConnection = null;
      state.tempPath = null;
    },
  },
});

export const { startConnection, updateTempPath, completeConnection, cancelConnection } = connectionsSlice.actions;
export default connectionsSlice.reducer;
