import styled from "@emotion/styled";
import { BorderStyle, BoxShadow, useMouseDown } from "./utils";
import { ComfyNodeProps, NodeContextType } from "types";
import { useContext, useState, MouseEvent, useRef, useEffect } from "react";
import ButtonsBar from "./components/ButtonsBar";
import { NodeContext } from "context/node-context";
import PlayButton from "./components/PlayButton";
import { endPorts } from ".";
import { Input, InputRef } from "antd";

export default function End(props: ComfyNodeProps) {
  const [showLabel, setShowLabel] = useState(props.nodeInfo?.label || '终止节点');
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const [showButton, setShowButton] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const { left, top } = useMouseDown(boxRef);
  const { onMouseDown, onDragStart, onRename, canvasOffsetTop } = useContext(
    NodeContext
  ) as NodeContextType;

  useEffect(() => {
    if (editing) inputRef.current?.focus({ cursor: 'all' });
  }, [editing]);

  const handleChange = () => {
    setEditing(false);
    onRename(props.nodeInfo?.id || '', showLabel);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (props.showingButton === "add") {
      onDragStart("end", { x: left, y: top - canvasOffsetTop });
    } else {
      onMouseDown(props.nodeInfo?.id || "");
    }
  };

  return (
    <EndBox
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
      <EndPort className="acea-row row-center">
        <PlayButton
          port={endPorts[0]}
          portIndex={0}
          parentNode={props.nodeInfo}
        />
      </EndPort>
      <EndMain
        className="node-name acea-row row-center"
        onMouseDown={(e) => handleMouseDown(e)}
        onClick={() => setEditing(true)}
      >
        {
          editing ?
          <Input
            ref={inputRef}
            value={showLabel}
            onBlur={handleChange}
            onPressEnter={handleChange}
            onChange={e => setShowLabel(e.target.value)}
          /> : <span>{showLabel}</span>
        }
      </EndMain>
    </EndBox>
  );
}

export const EndBox = styled.div`
  width: 12rem;
  height: 4rem;
  position: relative;
  border-radius: 0 2rem 2rem 0;
  border: ${BorderStyle};
  box-shadow: ${BoxShadow};

  .buttons-bar {
    top: -2rem;
    right: 0;
  }
`;

export const EndPort = styled.div`
  width: 4rem;
`;

export const EndMain = styled.div`
  flex: 1;
  height: 100%;
  border-left: ${BorderStyle};
  cursor: move;

  &:hover {
    span {
      transform: scale(1.1);
      transition: transform .5s ease-in-out;
    }
  }
`;
