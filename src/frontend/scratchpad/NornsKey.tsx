import React, { useCallback } from "react";
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
    background-color: whitesmoke;
  }

  &:active {
    background-color: gray;
  }
`;

export interface NornsKeyProps {
  onChange?: (isDown: boolean) => void;
}

export function NornsKey({ onChange }: NornsKeyProps): JSX.Element {
  const handleMouseUp = useCallback(() => {
    onChange && onChange(false);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [onChange]);

  const handleMouseDown = () => {
    onChange && onChange(true);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return <RoundButton radius={24} onMouseDown={handleMouseDown} />;
}
