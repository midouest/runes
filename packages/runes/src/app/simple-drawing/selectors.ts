import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectSimpleDrawing = (state: RootState) => state.simpleDrawing;

export const selectIsDrawing = createSelector(
  selectSimpleDrawing,
  (state) => state.isDrawing
);

export const selectTool = createSelector(
  selectSimpleDrawing,
  (state) => state.tool
);

export const selectPrimitives = createSelector(
  selectSimpleDrawing,
  (state) => state.primitives
);
