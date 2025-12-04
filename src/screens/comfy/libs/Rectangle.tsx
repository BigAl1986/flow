import styled from "@emotion/styled";
import { BorderStyle, BoxShadow, useMouseDown } from "./utils";
import ButtonsBar from "./components/ButtonsBar";
import { ComfyNodeProps, NodeContextType } from "types";
import { useContext, useState, MouseEvent, useRef } from "react";
import { NodeContext } from "context/node-context";
import PlayButton from "./components/PlayButton";
import { rectanglePorts } from ".";

export default function Rectangle(props: ComfyNodeProps) {
  const [showButton, setShowButton] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const { left, top } = useMouseDown(boxRef);
  const { onDragStart, onMouseDown, canvasOffsetTop } = useContext(
    NodeContext
  ) as NodeContextType;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (props.showingButton === "add") {
      onDragStart("rectangle", { x: left, y: top - canvasOffsetTop });
    } else {
      onMouseDown(props.nodeInfo?.id || "");
    }
  };

  return (
    <RectangleBox
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
      <RectanglePort className="acea-row row-center">
        <PlayButton
          port={rectanglePorts[0]}
          portIndex={0}
          parentNode={props.nodeInfo}
        />
      </RectanglePort>
      <RectangleMain
        className="node-name acea-row row-center"
        onMouseDown={(e) => handleMouseDown(e)}
      >
        <span>双向节点</span>
      </RectangleMain>
      <RectanglePort className="acea-row row-center">
        <PlayButton
          port={rectanglePorts[1]}
          portIndex={1}
          parentNode={props.nodeInfo}
        />
      </RectanglePort>
    </RectangleBox>
  );
}

export const RectangleBox = styled.div`
  width: 20rem;
  height: 4rem;
  position: relative;
  border-radius: 0.8rem;
  border: ${BorderStyle};
  box-shadow: ${BoxShadow};

  .buttons-bar {
    top: -2rem;
    right: 0;
  }
`;

export const RectanglePort = styled.div`
  width: 4rem;
`;

export const RectangleMain = styled.div`
  flex: 1;
  height: 100%;
  border-left: ${BorderStyle};
  border-right: ${BorderStyle};
  cursor: move;
`;
