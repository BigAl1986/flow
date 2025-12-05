import styled from "@emotion/styled";
import { BorderStyle, BoxShadow } from "./utils";
import { ComfyNodeProps, NodeContextType } from "types";
import PlayButton from "./components/PlayButton";
import { startPorts } from ".";
import { Input, InputRef } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { NodeContext } from "context/node-context";

export default function Start(props: ComfyNodeProps) {
  const [showLabel, setShowLabel] = useState(props.nodeInfo?.label || '启动节点');
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const { onRename } = useContext(NodeContext) as NodeContextType;

  const handleChange = () => {
    setEditing(false);
    onRename(props.nodeInfo?.id || '', showLabel);
  };

  useEffect(() => {
    if (editing) inputRef.current?.focus({ cursor: 'all' });
  }, [editing]);

  return (
    <StartBox
      className="comfy-node"
      style={{
        left: props.nodeInfo?.position?.x,
        top: props.nodeInfo?.position?.y,
      }}
    >
      <StartMain
        className="node-name acea-row row-center"
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
      </StartMain>
      <StartPort className="acea-row row-center">
        <PlayButton
          port={startPorts[0]}
          portIndex={0}
          parentNode={props.nodeInfo}
        />
      </StartPort>
    </StartBox>
  );
}

export const StartBox = styled.div`
  width: 12rem;
  height: 4rem;
  display: flex;
  align-items: center;
  border-radius: 2rem 0 0 2rem;
  border: ${BorderStyle};
  box-shadow: ${BoxShadow};
`;

export const StartPort = styled.div`
  width: 4rem;
`;

export const StartMain = styled.div`
  flex: 1;
  height: 100%;
  border-right: ${BorderStyle};

  &:hover {
    cursor: pointer;

    span {
      transform: scale(1.1);
      transition: transform .5s ease-in-out;
    }
  }
`;
