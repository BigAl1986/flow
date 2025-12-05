import styled from "@emotion/styled";
import { BorderStyle, BoxShadow } from "./utils";
import { ComfyNodeProps } from "types";
import PlayButton from "./components/PlayButton";
import { startPorts } from ".";
import NodeName from "./components/NodeName";

export default function Start(props: ComfyNodeProps) {
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
      >
        <NodeName nodeInfo={props.nodeInfo} />
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
`;
