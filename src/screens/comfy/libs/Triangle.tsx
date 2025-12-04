import styled from "@emotion/styled";
import { BorderStyle, useMouseDown } from "./utils";
import { useContext, useState, MouseEvent, useRef } from "react";
import ButtonsBar from "./components/ButtonsBar";
import { ComfyNodeProps, NodeContextType } from "types";
import { NodeContext } from "context/node-context";
import PlayButton from "./components/PlayButton";
import { trianglePorts } from ".";

export default function Triangle(props: ComfyNodeProps) {
  const [showButton, setShowButton] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const { left, top } = useMouseDown(boxRef);
  const { onMouseDown, onDragStart, canvasOffsetTop } = useContext(
    NodeContext
  ) as NodeContextType;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (props.showingButton === "add") {
      onDragStart("triangle", { x: left, y: top - canvasOffsetTop });
    } else {
      onMouseDown(props.nodeInfo?.id || "");
    }
  };

  return (
    <TriangleBox
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
      <TriangleWrap className="acea-row row-center">
        <LeftPort>
          <PlayButton
            port={trianglePorts[0]}
            portIndex={0}
            parentNode={props.nodeInfo}
          />
        </LeftPort>
        <TriangleRight>
          <RightPort>
            <PlayButton
              port={trianglePorts[1]}
              portIndex={1}
              parentNode={props.nodeInfo}
            />
          </RightPort>

          <TriangleMain
            className="node-name acea-row row-center"
            onMouseDown={(e) => handleMouseDown(e)}
          >
            <span>分叉节点</span>
          </TriangleMain>
          <RightPort>
            <PlayButton
              port={trianglePorts[2]}
              portIndex={2}
              parentNode={props.nodeInfo}
            />
          </RightPort>
        </TriangleRight>
      </TriangleWrap>
    </TriangleBox>
  );
}

export const TriangleBox = styled.div`
  width: 16rem;
  height: 16rem;
  position: relative;
  filter: drop-shadow(0 0 1px rgba(50, 50, 0, 0.5));

  .buttons-bar {
    top: 2rem;
    left: 2rem;
  }
`;

export const TriangleWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(0% 50%, 100% 0, 100% 100%);
  background: #fff;
`;

export const LeftPort = styled.div`
  width: 4rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const TriangleRight = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const RightPort = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const TriangleMain = styled.div`
  flex: 1;
  border: ${BorderStyle};
  cursor: move;
`;
