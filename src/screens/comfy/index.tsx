import styled from "@emotion/styled";
import point from "assets/point-01.svg";
import Rectangle from "./libs/Rectangle";
import Diamond from "./libs/Diamond";
import Triangle from "./libs/Triangle";
import End from "./libs/End";
import { useState, MouseEvent, useEffect, useRef } from "react";
import { FlowNode, NodeType, PortType, Position, SvgLine } from "types";
import MainCanvas from "./components/MainCanvas";
import { NodeContext } from "context/node-context";
import {
  diamondPorts,
  endPorts,
  libs,
  portsLib,
  rectanglePorts,
  startPorts,
  trianglePorts,
} from "./libs";
import { genRandomId } from "./libs/utils";
import { Button } from "antd";
import { useDebounce } from "../../utils/index";

export default function Comfy() {
  const isInitialRender = useRef(true);
  const [canvasOffsetLeft, setCanvasOffsetLeft] = useState<number>(0);
  const [canvasOffsetTop, setCanvasOffsetTop] = useState<number>(0);

  const [activedNode, setActivedNode] = useState<FlowNode | null>(null);
  const [nodeList, setNodeList] = useState<FlowNode[]>([]);

  const [drawingLine, setDrawingLine] = useState<SvgLine | null>(null);
  const [lineList, setLineList] = useState<SvgLine[]>([]);

  const [addingNode, setAddingNode] = useState<FlowNode | null>(null);
  // 为了解决不能在 return 函数之外把状态 set 为 JSX 的 react bug，需要在 return 函数中再去计算应该画出什么 JSX;
  const [drawingNodeList, setDrawingNodeList] = useState<
    (FlowNode | undefined)[]
  >([]);

  useEffect(() => {
    const lineListStorage = localStorage.getItem("lineList");
    if (lineListStorage) {
      const list = JSON.parse(lineListStorage) as SvgLine[];
      setLineList(list);
    } else {
      setLineList([
        {
          id: "07831680",
          sourceNodeId: "start",
          sourcePortIndex: 0,
          targetNodeId: "33228236",
          targetPortIndex: 0,
          startPos: { x: 106, y: 28 },
          endPos: { x: 253, y: 234 },
        },
        {
          id: "49097069",
          sourceNodeId: "33228236",
          sourcePortIndex: 1,
          targetNodeId: "27017427",
          targetPortIndex: 1,
          startPos: { x: 371, y: 168 },
          endPos: { x: 627, y: 236 },
        },
        {
          id: "56574285",
          sourceNodeId: "27017427",
          sourcePortIndex: 2,
          targetNodeId: "32619822",
          targetPortIndex: 0,
          startPos: { x: 787, y: 233 },
          endPos: { x: 974, y: 99 },
        },
        {
          id: "58456975",
          sourceNodeId: "33228236",
          sourcePortIndex: 2,
          targetNodeId: "27017427",
          targetPortIndex: 0,
          startPos: { x: 371, y: 296 },
          endPos: { x: 713, y: 150 },
        },
        {
          id: "30722765",
          sourceNodeId: "27017427",
          sourcePortIndex: 3,
          targetNodeId: "04785270",
          targetPortIndex: 0,
          startPos: { x: 707, y: 317 },
          endPos: { x: 927, y: 457 },
        },
        {
          id: "98740711",
          sourceNodeId: "04785270",
          sourcePortIndex: 1,
          targetNodeId: "12971379",
          targetPortIndex: 0,
          startPos: { x: 1087, y: 453 },
          endPos: { x: 1330, y: 538 },
        },
        {
          id: "56059125",
          sourceNodeId: "32619822",
          sourcePortIndex: 1,
          targetNodeId: "70488904",
          targetPortIndex: 0,
          startPos: { x: 1128, y: 97 },
          endPos: { x: 1377, y: 106 },
        },
      ]);
    }
    const nodeListStorage = localStorage.getItem("nodeList");
    if (nodeListStorage) {
      const list = JSON.parse(nodeListStorage) as FlowNode[];
      setNodeList(list);
    } else {
      setNodeList([
        {
          id: "start",
          type: "start",
          position: { x: 10, y: 10 },
          ports: [{ type: "exit", offsetX: 96, offsetY: 18 }],
        },
        {
          id: "33228236",
          type: "triangle",
          position: { x: 223, y: 154 },
          ports: [
            { type: "entrance", offsetX: 28, offsetY: 78 },
            { type: "exit", offsetX: 148, offsetY: 14 },
            { type: "exit", offsetX: 148, offsetY: 142 },
          ],
        },
        {
          id: "27017427",
          type: "diamond",
          position: { x: 609, y: 135 },
          ports: [
            { type: "entrance", offsetX: 98, offsetY: 12 },
            { type: "entrance", offsetX: 18, offsetY: 98 },
            { type: "exit", offsetX: 178, offsetY: 98 },
            { type: "exit", offsetX: 98, offsetY: 182 },
          ],
        },
        {
          id: "32619822",
          type: "rectangle",
          position: { x: 952, y: 79 },
          ports: [
            { type: "entrance", offsetX: 18, offsetY: 18 },
            { type: "exit", offsetX: 176, offsetY: 18 },
          ],
        },
        {
          id: "04785270",
          type: "rectangle",
          position: { x: 911, y: 435 },
          ports: [
            { type: "entrance", offsetX: 18, offsetY: 18 },
            { type: "exit", offsetX: 176, offsetY: 18 },
          ],
        },
        {
          id: "70488904",
          type: "end",
          position: { x: 1357, y: 87 },
          ports: [{ type: "entrance", offsetX: 18, offsetY: 18 }],
        },
        {
          id: "12971379",
          type: "end",
          position: { x: 1307, y: 518 },
          ports: [{ type: "entrance", offsetX: 18, offsetY: 18 }],
        },
      ]);
    }
  }, []);
  const debounceLineList = useDebounce(lineList, 1000);
  const debounceNodeList = useDebounce(nodeList, 1000);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      localStorage.setItem("lineList", JSON.stringify(debounceLineList));
      localStorage.setItem("nodeList", JSON.stringify(debounceNodeList));
    }
  }, [debounceLineList, debounceNodeList]);

  const onAdd = (type: NodeType) => {
    setNodeList(
      nodeList.concat({
        id: genRandomId(),
        type,
        position: {
          x: 100,
          y: 100,
        },
        ports: portsLib[`${type}Ports`] || [],
      })
    );
  };
  const onRemove = (id: string) => {
    setNodeList(nodeList.filter((node) => node.id !== id));
    setLineList(
      lineList.filter(
        (line) => line.sourceNodeId !== id && line.targetNodeId !== id
      )
    );
  };
  const onMouseDown = (id: string) => {
    const actived = nodeList.find((node) => node.id === id) || null;
    setActivedNode(actived);
  };
  const onMouseUp = () => {
    setActivedNode(null);
  };
  const onMouseMove = (pos: Position) => {
    if (activedNode) {
      let x = pos.x + (activedNode.position?.x || 0);
      if (x < 10) x = 10;
      let y = pos.y + (activedNode.position?.y || 0);
      if (y < 10) y = 10;

      activedNode.position = { x, y };
      const activedIndex = nodeList.findIndex(
        (node) => node.id === activedNode.id
      );
      const newNodeList = [...nodeList];
      newNodeList.splice(activedIndex, 1, activedNode);
      setNodeList(newNodeList);

      const newLineList = [...lineList];
      newLineList.forEach((line) => {
        if (line.sourceNodeId === activedNode.id) {
          line.startPos = {
            x: x + activedNode.ports[line.sourcePortIndex].offsetX,
            y: y + activedNode.ports[line.sourcePortIndex].offsetY,
          };
        }
        if (line.targetNodeId === activedNode.id) {
          line.endPos = {
            x: x + activedNode.ports[line.targetPortIndex].offsetX,
            y: y + activedNode.ports[line.targetPortIndex].offsetY,
          };
        }
      });
      setLineList(newLineList);
    } else if (drawingLine) {
      let x = pos.x + drawingLine.endPos?.x;
      let y = pos.y + drawingLine.endPos?.y;
      setDrawingLine({
        ...drawingLine,
        endPos: { x, y },
      });
    } else {
      return;
    }
  };
  const onMouseLeave = () => {
    setActivedNode(null);
    setDrawingLine(null);
  };
  const onPlayButtonClick = (
    type: PortType,
    clickNodeId: string,
    clickPortIndex: number,
    pos1: Position,
    pos2: Position
  ) => {
    if (!drawingLine && type === "exit") {
      setDrawingLine({
        id: genRandomId(),
        sourceNodeId: clickNodeId,
        sourcePortIndex: clickPortIndex,
        targetNodeId: "",
        targetPortIndex: 0,
        startPos: pos1,
        endPos: pos2,
      });
    }
    if (drawingLine && type === "entrance") {
      setLineList(
        lineList.concat({
          ...drawingLine,
          targetNodeId: clickNodeId,
          targetPortIndex: clickPortIndex,
        })
      );
      setDrawingLine(null);
    }
    return;
  };
  const onDragStart = (type: NodeType, position: Position) => {
    setAddingNode({
      id: genRandomId(),
      type,
      position,
      ports: portsLib[`${type}Ports`],
    });
    setDrawingNodeList([
      {
        id: genRandomId(),
        type,
        position,
        ports: portsLib[`${type}Ports`],
      },
    ]);
  };
  const onDragEnd = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.pageX > canvasOffsetLeft && e.pageY > canvasOffsetTop && addingNode) {
      setNodeList(
        nodeList.concat({
          ...addingNode,
          position: {
            x: (addingNode.position?.x || 0) - canvasOffsetLeft,
            y: addingNode.position?.y || 0,
          },
        })
      );
    }
    setAddingNode(null);
    setDrawingNodeList([]);
  };
  const onDragMove = (pos: Position) => {
    if (addingNode) {
      const newNode = { ...addingNode };
      newNode.position = {
        x: (newNode.position?.x || 0) + pos.x,
        y: (newNode.position?.y || 0) + pos.y,
      };
      setAddingNode(newNode);
      setDrawingNodeList([newNode]);
    }
  };
  const onMouseLeaveAll = () => {
    setAddingNode(null);
    setDrawingNodeList([]);
  };
  const onLineDelete = (parantId: string, index: number) => {
    const newLineList = [...lineList];
    const lineIndex = newLineList.findIndex(
      (line) =>
        (line.sourceNodeId === parantId && line.sourcePortIndex === index) ||
        (line.targetNodeId === parantId && line.targetPortIndex === index)
    );
    newLineList.splice(lineIndex, 1);
    setLineList(newLineList);
  };
  const handleClear = () => {
    setNodeList([
      {
        id: "start",
        type: "start",
        position: {
          x: 10,
          y: 10,
        },
        ports: startPorts,
      },
    ]);
    setLineList([]);
  };

  return (
    <NodeContext.Provider
      value={{
        nodeList,
        onRemove,
        onAdd,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onMouseLeave,
        lineList,
        drawingLine,
        onPlayButtonClick,
        canvasOffsetLeft,
        setCanvasOffsetLeft,
        canvasOffsetTop,
        setCanvasOffsetTop,
        onDragStart,
        onDragMove,
        onMouseLeaveAll,
        onLineDelete,
      }}
    >
      <ComfyWrap
        onMouseUp={(e) => onDragEnd(e)}
        onMouseLeave={onMouseLeaveAll}
        onMouseMove={(e) => onDragMove({ x: e.movementX, y: e.movementY })}
      >
        <DrawingWrap>
          {drawingNodeList?.map((node) => {
            const lib = libs.filter((lib) => lib.type === node?.type)[0];
            const { Node } = lib;
            return (
              <Node key={node?.id} showingButton="remove" nodeInfo={node} />
            );
          })}
        </DrawingWrap>
        <ComponentLib>
          <Rectangle
            showingButton="add"
            nodeInfo={{ id: "", type: "rectangle", ports: rectanglePorts }}
          />
          <Triangle
            showingButton="add"
            nodeInfo={{ id: "", type: "triangle", ports: trianglePorts }}
          />
          <Diamond
            showingButton="add"
            nodeInfo={{ id: "", type: "diamond", ports: diamondPorts }}
          />
          <End
            showingButton="add"
            nodeInfo={{ id: "", type: "end", ports: endPorts }}
          />
        </ComponentLib>
        <ComfyCanvas>
          <MainCanvas />
        </ComfyCanvas>
        {(nodeList.length > 1 || lineList.length) && (
          <Button type="link" onClick={handleClear}>
            清空
          </Button>
        )}
      </ComfyWrap>
    </NodeContext.Provider>
  );
}

export const ComfyWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  position: relative;

  .ant-btn {
    position: absolute;
    left: 24rem;
    top: 95%;
  }
`;

export const DrawingWrap = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`;

export const ComponentLib = styled.div`
  width: 24rem;
  box-shadow: #eee 0px 0px 5px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .comfy-node {
    margin-top: 4rem;

    .node-name {
      span {
        transition: transform 0.3s ease-in-out;
      }

      &:hover {
        cursor: pointer;
        span {
          transform: scale(1.1);
        }
      }
    }
  }
`;

export const ComfyCanvas = styled.div`
  flex: 1;
  background: url(${point});
`;
