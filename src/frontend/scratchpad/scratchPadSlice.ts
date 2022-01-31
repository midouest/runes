import { createSlice } from "@reduxjs/toolkit";

export interface ScratchPadState {
  code: string;
}

export const initialState: ScratchPadState = {
  code: "",
} as const;

const scratchPadSlice = createSlice({
  name: "scratchPad",
  initialState,
  reducers: {},
});

const scratchPadReducer = scratchPadSlice.reducer;

export default scratchPadReducer;
