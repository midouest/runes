import React from "react";
import { useDispatch } from "react-redux";
import { capitalize } from "../util/string";
import { clearPrimitives, setTool } from "./simpleDrawingSlice";
import { Tool, TOOLS } from "./tool";
import styled from "styled-components";

const ToolbarWrapper = styled.div`
  display: flex;
`;

const Spacer = styled.span`
  flex: 1;
`;

export function Toolbar() {
  const dispatch = useDispatch();

  const dispatchSetTool = (tool: Tool) => () => dispatch(setTool(tool));

  return (
    <ToolbarWrapper>
      {TOOLS.map((tool) => (
        <button key={tool} onClick={dispatchSetTool(tool)}>
          {capitalize(tool)}
        </button>
      ))}
      <Spacer />
      <button onClick={() => dispatch(clearPrimitives())}>Clear</button>
    </ToolbarWrapper>
  );
}
