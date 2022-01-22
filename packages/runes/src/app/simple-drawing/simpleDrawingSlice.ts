import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Primitive } from "./primitives";
import { Tool } from "./tool";

export interface SimpleDrawingState {
  isDrawing: boolean;
  tool: Tool;
  primitives: Primitive[];
}

const initialState: SimpleDrawingState = {
  isDrawing: false,
  tool: "pixel",
  primitives: [],
};

export const simpleDrawingSlice = createSlice({
  name: "simple-drawing",
  initialState,
  reducers: {
    setTool: (state: SimpleDrawingState, action: PayloadAction<Tool>) => {
      state.tool = action.payload;
      state.isDrawing = false;
    },
    addPrimitive: (
      state: SimpleDrawingState,
      action: PayloadAction<Primitive>
    ) => {
      state.primitives.push(action.payload);
      state.isDrawing = false;
    },
    clearPrimitives: (state: SimpleDrawingState) => {
      state.primitives = [];
      state.isDrawing = false;
    },
    startDrawing: (state: SimpleDrawingState) => {
      state.isDrawing = true;
    },
  },
});

export const { setTool, addPrimitive, clearPrimitives, startDrawing } =
  simpleDrawingSlice.actions;

const simpleDrawingReducer = simpleDrawingSlice.reducer;

export default simpleDrawingReducer;
