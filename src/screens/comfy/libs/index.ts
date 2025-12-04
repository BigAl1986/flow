import { ComfyNode, Port } from "types";
import Rectangle from "./Rectangle";
import Diamond from "./Diamond";
import Triangle from "./Triangle";
import End from "./End";
import Start from "./Start";

export const libs: ComfyNode[] = [
  {
    type: "rectangle",
    Node: Rectangle,
  },
  {
    type: "diamond",
    Node: Diamond,
  },
  {
    type: "triangle",
    Node: Triangle,
  },
  {
    type: "end",
    Node: End,
  },
  {
    type: "start",
    Node: Start,
  },
];

export const startPorts: Port[] = [
  {
    type: "exit",
    offsetX: 96,
    offsetY: 18,
  },
];

export const rectanglePorts: Port[] = [
  {
    type: "entrance",
    offsetX: 18,
    offsetY: 18,
  },
  {
    type: "exit",
    offsetX: 176,
    offsetY: 18,
  },
];

export const diamondPorts: Port[] = [
  {
    type: "entrance",
    offsetX: 98,
    offsetY: 12,
  },
  {
    type: "entrance",
    offsetX: 18,
    offsetY: 98,
  },
  {
    type: "exit",
    offsetX: 178,
    offsetY: 98,
  },
  {
    type: "exit",
    offsetX: 98,
    offsetY: 182,
  },
];

export const trianglePorts: Port[] = [
  {
    type: "entrance",
    offsetX: 28,
    offsetY: 78,
  },
  {
    type: "exit",
    offsetX: 148,
    offsetY: 14,
  },
  {
    type: "exit",
    offsetX: 148,
    offsetY: 142,
  },
];

export const endPorts: Port[] = [
  {
    type: "entrance",
    offsetX: 18,
    offsetY: 18,
  },
];

export const portsLib = {
  startPorts,
  rectanglePorts,
  diamondPorts,
  trianglePorts,
  endPorts,
};
