import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4px;
  padding: 8px;
  border: 1px solid black;
  border-radius: 4px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 4px 0;
`;

interface SpacerProps {
  size?: number;
}

export const Spacer = styled.div<SpacerProps>`
  flex: ${(props) => props.size ?? 1};
`;

export const MatronCanvas = styled.canvas`
  background: black;
  image-rendering: pixelated;
`;
