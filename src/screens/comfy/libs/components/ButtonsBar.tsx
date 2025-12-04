import styled from "@emotion/styled";
import { ButtonsBarProps, NodeContextType } from "types";
import { ReactComponent as Add } from "assets/add.svg";
import { ReactComponent as Remove } from "assets/remove.svg";
import { useContext } from "react";
import { NodeContext } from "context/node-context";

export default function ButtonsBar(props: ButtonsBarProps) {
  const { onRemove, onAdd } = useContext(NodeContext) as NodeContextType;

  return (
    <ButtonsBarBox className="buttons-bar acea-row row-center">
      <ButtonWrap style={{ top: props.isShow ? "0" : "100%" }}>
        {props.showingButton === "add" ? (
          <Add onClick={() => onAdd(props.type)} />
        ) : (
          <Remove onClick={() => onRemove(props.id || "")} />
        )}
      </ButtonWrap>
    </ButtonsBarBox>
  );
}

export const ButtonsBarBox = styled.div`
  width: 2rem;
  height: 2rem;
  overflow: hidden;
  position: absolute;
`;

export const ButtonWrap = styled.div`
  position: absolute;
  transition: top 0.3s ease-in-out;
  color: #999;

  &:hover {
    cursor: pointer;
    color: #666;
  }
`;
