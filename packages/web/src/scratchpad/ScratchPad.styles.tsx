import styled from "styled-components";

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

interface SpacerProps {
  size?: number;
}

export const Spacer = styled.div<SpacerProps>`
  flex: ${(props) => props.size ?? 1};
`;

export const MatronCanvas = styled.canvas`
  background: black;
  width: 512px;
  height: 256px;
  image-rendering: pixelated;
`;
