import { MutableRefObject, useEffect, useState } from "react";
import { SvgLine } from "types";

export const BorderStyle = "1px solid rgba(200, 200, 200, 0.5)";

export const BoxShadow = "0 0 0.5rem 0 #ccc";

export const genRandomId = () =>
  Math.random().toFixed(8).toString().split(".")[1];

export const genBezierCurvePoints = (line: SvgLine | null) => {
  if (!line) return {};
  const { x: x1, y: y1 } = line.startPos;
  const { x: x4, y: y4 } = line.endPos;
  const minGapX = x4 === x1 ? 100 : 100 * (Math.abs(x4 - x1) / (x4 - x1));
  const x2 = x1 + minGapX;
  const x3 = x4 - minGapX;
  const y2 = y1;
  const y3 = y4;

  return { x1, y1, x2, y2, x3, y3, x4, y4 };
};

export const useMouseDown = (
  boxRef: MutableRefObject<HTMLDivElement | null>
) => {
  const [left, setLeft] = useState<number>(0);
  const [top, setTop] = useState<number>(0);

  useEffect(() => {
    const rect = boxRef.current;
    if (rect) {
      const { left, top } = rect.getBoundingClientRect();
      setLeft(left);
      setTop(top);
    }
  }, []);

  return { left, top };
};
