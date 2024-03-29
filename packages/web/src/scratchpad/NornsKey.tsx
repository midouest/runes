import { useCallback } from "react";
import styled from "styled-components";

interface RoundButtonProps {
  radius: number;
}

const RoundButton = styled.button<RoundButtonProps>`
  display: inline-block;
  width: ${(props) => props.radius * 2}px;
  height: ${(props) => props.radius * 2}px;
  border: none;
  border-radius: ${(props) => props.radius}px;
  text-decoration: none;
  background-color: lightgray;

  &:hover {
    background-color: gainsboro;
  }

  &:active {
    background-color: silver;
  }
`;

export interface NornsKeyProps {
  keyId: number;
  onChange?: (isDown: boolean) => void;
}

export function NornsKey({ keyId, onChange }: NornsKeyProps): JSX.Element {
  const handleMouseUp = useCallback(() => {
    onChange && onChange(false);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [onChange]);

  const handleMouseDown = () => {
    onChange && onChange(true);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <RoundButton
      radius={24}
      onMouseDown={handleMouseDown}
      title={`Key ${keyId}`}
    />
  );
}
