import { Rate } from "antd";

interface PinProps extends React.ComponentProps<typeof Rate> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Pin = (props: PinProps) => {
  return (
    <Rate
      count={1}
      value={props.checked ? 1 : 0}
      onChange={(num) => props.onCheckedChange?.(!!num)}
    />
  );
};
