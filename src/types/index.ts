import { FC } from "react";

export type Raw = string | number;

export interface Project {
  id: number;
  name: string;
  personId: number;
  organization: string;
  created: number;
  pin: boolean;
}

export interface User {
  id: number;
  name: string;
  token: string;
}

export interface Kanban {
  id: number;
  name: string;
  projectId: number;
}

export interface Task {
  id: number;
  name: string;
  processorId: number;
  projectId: number;
  epicId: number;
  kanbanId: number;
  typeId: number;
  note: string;
}

export interface TaskType {
  id: number;
  name: string;
}

export interface SortProps {
  fromId?: number;
  referenceId?: number;
  type: "before" | "after";
  fromKanbanId?: number;
  toKanbanId?: number;
}

export interface Epic {
  id: number;
  name: string;
  projectId: number;
  start: number;
  end: number;
}

export interface Flow {
  id: string;
  name: string;
  personId: number;
  organization: string;
  created: number;
}

export interface Position {
  x: number;
  y: number;
}

export type NodeType = "rectangle" | "triangle" | "diamond" | "end" | "start";

export interface ComfyNode {
  type: NodeType;
  Node: FC<ComfyNodeProps>;
}

export type PortType = "entrance" | "exit";

export interface Port {
  type: PortType;
  offsetX: number;
  offsetY: number;
}

export interface FlowNode {
  id: string;
  type: NodeType;
  position?: Position;
  ports: Port[];
}

export interface FlowNodeList {
  flowId: number;
  list: FlowNode[];
}

export interface ButtonsBarProps {
  id?: string;
  type: NodeType;
  showingButton: "add" | "remove";
  isShow: boolean;
}

export interface PlayButtonProps {
  parentNode?: FlowNode;
  portIndex: number;
  port: Port;
}

export interface ComfyNodeProps {
  nodeInfo?: FlowNode;
  showingButton: "add" | "remove";
}

export interface SvgLine {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourcePortIndex: number;
  targetPortIndex: number;
  startPos: Position;
  endPos: Position;
}

export interface SvgLineList {
  flowId: number;
  list: SvgLine[];
}

export interface NodeContextType {
  canvasOffsetLeft: number;
  setCanvasOffsetLeft: (left: number) => void;
  canvasOffsetTop: number;
  setCanvasOffsetTop: (top: number) => void;
  nodeList: FlowNode[];
  lineList: SvgLine[];
  drawingLine: SvgLine | null;
  onPlayButtonClick: (
    type: PortType,
    clickNodeId: string,
    clickPortIndex: number,
    pos1: Position,
    pos2: Position
  ) => void;
  // 点击+、-按钮；
  onRemove: (id: string) => void;
  onAdd: (type: NodeType) => void;
  // 右侧画布的鼠标事件：主要响应节点移动、曲线重绘的功能；
  onMouseDown: (id: string) => void;
  onMouseUp: () => void;
  onMouseMove: (pos: Position) => void;
  onMouseLeave: () => void;
  // 整个编辑区的鼠标事件：主要响应从左侧组件库拖动节点添加到画布中的功能；
  onDragStart: (type: NodeType, pos: Position) => void;
  onDragMove: (pos: Position) => void;
  onMouseLeaveAll: () => void;
  onLineDelete: (parantId: string, index: number) => void;
}
