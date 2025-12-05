import styled from "@emotion/styled";
import { BorderStyle, BoxShadow, useMouseDown } from "./utils";
import { useContext, useState, MouseEvent, useRef } from "react";
import ButtonsBar from "./components/ButtonsBar";
import { ComfyNodeProps, NodeContextType } from "types";
import { NodeContext } from "context/node-context";
import PlayButton from "./components/PlayButton";
import { diamondPorts } from ".";
import NodeName from "./components/NodeName";

export default function Diamond(props: ComfyNodeProps) {
  const [showButton, setShowButton] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const { left, top } = useMouseDown(boxRef);
  const { onMouseDown, onDragStart, canvasOffsetTop } = useContext(
    NodeContext
  ) as NodeContextType;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (props.showingButton === "add") {
      onDragStart("diamond", { x: left, y: top - canvasOffsetTop });
    } else {
      onMouseDown(props.nodeInfo?.id || "");
    }
  };

  return (
    <DiamondBox
      ref={boxRef}
      className="comfy-node acea-row row-center"
      style={{
        left: props.nodeInfo?.position?.x,
        top: props.nodeInfo?.position?.y,
      }}
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
    >
      <ButtonsBar
        id={props.nodeInfo?.id}
        type={props.nodeInfo?.type || "start"}
        showingButton={props.showingButton}
        isShow={showButton}
      />
      <DiamondeWrap className="acea-row row-center">
        <DiamondInner className="acea-row row-center">
          <VirticalPort className="acea-row row-center">
            <PlayButton
              port={diamondPorts[0]}
              portIndex={0}
              parentNode={props.nodeInfo}
            />
          </VirticalPort>
          <DiamondMiddle className="acea-row row-center">
            <RowPort className="acea-row row-center">
              <PlayButton
                port={diamondPorts[1]}
                portIndex={1}
                parentNode={props.nodeInfo}
              />
            </RowPort>
            <DiamondMain
              className="node-name acea-row row-center"
              onMouseDown={(e) => handleMouseDown(e)}
            >
              <NodeName nodeInfo={props.nodeInfo} />
            </DiamondMain>
            <RowPort className="acea-row row-center">
              <PlayButton
                port={diamondPorts[2]}
                portIndex={2}
                parentNode={props.nodeInfo}
              />
            </RowPort>
          </DiamondMiddle>
          <VirticalPort className="acea-row row-center">
            <PlayButton
              port={diamondPorts[3]}
              portIndex={3}
              parentNode={props.nodeInfo}
            />
          </VirticalPort>
        </DiamondInner>
      </DiamondeWrap>
    </DiamondBox>
  );
}

export const DiamondBox = styled.div`
  width: 20rem;
  height: 20rem;
  position: relative;

  .buttons-bar {
    top: 2rem;
    left: 2rem;
  }
`;

export const DiamondeWrap = styled.div`
  width: 14rem;
  height: 14rem;
  overflow: hidden;
  transform: rotate(45deg);
  border: ${BorderStyle};
  box-shadow: ${BoxShadow};
`;

export const DiamondInner = styled.div`
  height: 20rem;
  transform: rotate(-45deg);
  display: flex;
  flex-direction: column;
`;

export const VirticalPort = styled.div`
  height: 3rem;

  > svg {
    transform: rotate(90deg);
  }
`;

export const DiamondMiddle = styled.div`
  flex: 1;
  width: 20rem;
  border-top: ${BorderStyle};
  border-bottom: ${BorderStyle};
  display: flex;
`;

export const RowPort = styled.div`
  width: 4rem;
`;

export const DiamondMain = styled.div`
  flex: 1;
  height: 100%;
  border-left: ${BorderStyle};
  border-right: ${BorderStyle};
  cursor: move;
`;
