import { useCallback, useRef, useState } from "react";
import styled from "styled-components";

const StyledSvg = styled.svg`
  width: 48px;
  height: 48px;

  circle {
    fill: lightgray;
  }

  line {
    stroke: black;
    stroke-width: 1;
  }
`;

interface NornsEncoderProps {
  onChange?: (delta: number) => void;
}

export function NornsEncoder({ onChange }: NornsEncoderProps): JSX.Element {
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
      onChange && onChange(delta);
    },
    [onChange]
  );

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [onChange]);

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <StyledSvg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" onMouseDown={handleMouseDown} />
      <line
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
