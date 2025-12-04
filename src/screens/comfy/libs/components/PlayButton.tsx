import styled from "@emotion/styled";
import { ReactComponent as Play } from "assets/play.svg";
import { ReactComponent as Close } from "assets/close.svg";
import { NodeContext } from "context/node-context";
import { MouseEvent, useContext, useState } from "react";
import { NodeContextType, PlayButtonProps } from "types";

export default function PlayButton(props: PlayButtonProps) {
  const {
    onPlayButtonClick,
    onLineDelete,
    canvasOffsetLeft,
    canvasOffsetTop,
    lineList,
  } = useContext(NodeContext) as NodeContextType;
  const beenUsed = lineList.filter(
    (line) =>
      (line.sourceNodeId === props.parentNode?.id &&
        line.sourcePortIndex === props.portIndex) ||
      (line.targetNodeId === props.parentNode?.id &&
        line.targetPortIndex === props.portIndex)
  ).length;
  const [showIcon, setShowIcon] = useState<boolean>(false);

  const handlePlayClick = (e: MouseEvent<SVGSVGElement>) => {
    if (beenUsed) return;
    onPlayButtonClick(
      props.port.type,
      props.parentNode?.id || "",
      props.portIndex,
      {
        x: (props.parentNode?.position?.x || 0) + props.port.offsetX,
        y: (props.parentNode?.position?.y || 0) + props.port.offsetY,
      },
      {
        x: e.pageX - canvasOffsetLeft,
        y: e.pageY - canvasOffsetTop,
      }
    );
  };

  const handleMouseEnter = () => {
    if (beenUsed) setShowIcon(true);
  };
  const handleMouseLeave = () => {
    setShowIcon(false);
  };
  const handleIconClick = () => {
    onLineDelete(props.parentNode?.id || "", props.portIndex);
    setShowIcon(false);
  };

  return (
    <PlayBox
      className="acea-row row-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Play onClick={(e) => handlePlayClick(e)} />
      {showIcon && <Close className="close-icon" onClick={handleIconClick} />}
    </PlayBox>
  );
}

export const PlayBox = styled.div`
  position: relative;

  .close-icon {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 10px;
    top: 10px;

    &:hover {
      cursor: pointer;
    }
  }
`;
