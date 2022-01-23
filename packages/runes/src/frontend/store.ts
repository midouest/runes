import { configureStore } from "@reduxjs/toolkit";
import { simpleDrawingReducer } from "./simple-drawing";

export const store = configureStore({
  reducer: {
    simpleDrawing: simpleDrawingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
