import styled from "@emotion/styled";
import { libs } from "../libs";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { NodeContext } from "context/node-context";
import { genBezierCurvePoints } from "../libs/utils";
import { NodeContextType } from "types";

export default function MainCanvas() {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const svgRef = useRef<HTMLDivElement | null>(null);

  const {
    nodeList = [],
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    lineList = [],
    drawingLine,
    setCanvasOffsetLeft,
    setCanvasOffsetTop,
  } = useContext(NodeContext) as NodeContextType;
  const { x1, y1, x2, y2, x3, y3, x4, y4 } = genBezierCurvePoints(drawingLine);
  useEffect(() => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const { width, height, left, top } = rect;
      setWidth(width);
      setHeight(height);
      setCanvasOffsetLeft(left);
      setCanvasOffsetTop(top);
    }
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onMouseMove({ x: e.movementX, y: e.movementY });
  };

  return (
    <MainCanvasBox
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseUp={() => onMouseUp()}
      onMouseLeave={() => onMouseLeave()}
    >
      <LinesBox className="inner-box" ref={svgRef}>
        <CopyrightWords>
          create with React@18 FC、svg, by kasy-huang 2025
        </CopyrightWords>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4653"
          width={width}
          height={height}
        >
          {lineList.map((line) => {
            const { x1, y1, x2, y2, x3, y3, x4, y4 } =
              genBezierCurvePoints(line);
            return (
              <path
                key={line.id}
                d={`M ${x1} ${y1} C ${x2} ${y2} ${x3} ${y3} ${x4} ${y4}`}
                fillOpacity={0}
                stroke="#1890ff"
                strokeWidth={5}
                strokeDasharray={10}
                strokeDashoffset={0}
              ></path>
            );
          })}
          {drawingLine ? (
            <path
              d={`M ${x1} ${y1} C ${x2} ${y2} ${x3} ${y3} ${x4} ${y4}`}
              fillOpacity={0}
              stroke="skyblue"
              strokeWidth={5}
              strokeDasharray={10}
              strokeDashoffset={0}
            ></path>
          ) : (
            <></>
          )}
        </svg>
      </LinesBox>
      <NodesBox className="inner-box">
        {nodeList.map((node) => {
          const lib = libs.filter((lib) => lib.type === node.type)[0];
          const { Node } = lib;
          return <Node key={node.id} showingButton="remove" nodeInfo={node} />;
        })}
      </NodesBox>
    </MainCanvasBox>
  );
}

export const MainCanvasBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .inner-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export const LinesBox = styled.div`
  position: relative;

  svg path {
    animation: dash 2s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: -100;
    }
  }
`;

export const CopyrightWords = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  margin-bottom: 5px;
  text-align: center;
  color: #ddd;
`;

export const NodesBox = styled.div`
  .comfy-node {
    position: absolute;
  }
`;
