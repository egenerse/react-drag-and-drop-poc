import { configureStore } from "@reduxjs/toolkit";
import canvasReducer from "./canvasSlice";
import connectionsReducer from './connectionsSlice';
import relationshipsReducer from './relationsSlice';

const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    connections: connectionsReducer,
    relationships: relationshipsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
