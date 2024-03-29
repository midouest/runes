import {
  useCallback,
  useRef,
  useState,
  MouseEvent as ReactMouseEvent,
} from "react";
import styled from "styled-components";
import { sign } from "../util/math";

const StyledSvg = styled.svg<{ dragging?: boolean }>`
  width: 48px;
  height: 48px;

  circle {
    fill: ${({ dragging }) => (dragging ? "silver" : "lightgray")};

    &:hover {
      fill: ${({ dragging }) => (dragging ? "silver" : "gainsboro")};
    }
  }

  line {
    stroke: black;
    stroke-width: 1;
  }
`;

interface NornsEncoderProps {
  encId: number;
  onChange?: (delta: number) => void;
}

export function NornsEncoder({
  encId,
  onChange,
}: NornsEncoderProps): JSX.Element {
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const prevRotationRef = useRef(0);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const delta =
        Math.abs(event.movementX) > Math.abs(event.movementY)
          ? event.movementX
          : -event.movementY;
      prevRotationRef.current = prevRotationRef.current + delta;
      setRotation(prevRotationRef.current);
      onChange && onChange(sign(delta));
    },
    [onChange]
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setDragging(false);
    },
    [handleMouseMove]
  );

  const handleMouseDown = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      setDragging(true);
    },
    [handleMouseMove, handleMouseUp]
  );

  return (
    <StyledSvg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      dragging={dragging}
    >
      <title>Encoder {encId}</title>
      <circle cx="50" cy="50" r="50" onMouseDown={handleMouseDown} />
      <line
        pointerEvents="none"
        x1="50"
        y1="50"
        x2="50"
        y2="0"
        transform={`rotate(${rotation})`}
        transform-origin="50 50"
      />
    </StyledSvg>
  );
}
