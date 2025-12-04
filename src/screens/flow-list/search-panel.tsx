import { Form, Input } from "antd";
import { UserSelect } from "components/user-select";
import { Flow } from "types";

interface SearchPanelProps {
  param: Partial<Pick<Flow, "name" | "personId">>;
  setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ param, setParam }: SearchPanelProps) => {
  return (
    <Form layout="inline" style={{ marginBottom: "2rem" }}>
      <Form.Item>
        <Input
          placeholder="流程名"
          type="text"
          value={param.name}
          onChange={(e) =>
            setParam({
              ...param,
              name: e.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName="负责人"
          value={param.personId}
          onChange={(e) =>
            setParam({
              ...param,
              personId: e,
            })
          }
        />
      </Form.Item>
    </Form>
  );
};
