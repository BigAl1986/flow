import { Button, Input } from "antd";
import { Row } from "components/lib";
import { TaskTypesSelect } from "components/taskType-select";
import { UserSelect } from "components/user-select";
import { useUrlQueryParam } from "utils";
import { useTaskSearchParams } from "./utils";
import { UndoOutlined } from "@ant-design/icons";

export const SearchPanel = () => {
  const searchParams = useTaskSearchParams();
  const [, setSearchParams] = useUrlQueryParam([]);
  const reset = () => {
    setSearchParams({
      typeId: undefined,
      processorId: undefined,
      tagId: undefined,
      name: undefined,
    });
  };

  return (
    <Row marginBottom={4} gap>
      <Input
        style={{ width: "20rem" }}
        placeholder="任务名"
        value={searchParams.name}
        onChange={(e) => setSearchParams({ name: e.target.value })}
      />
      <UserSelect
        defaultOptionName="经办人"
        value={searchParams.processorId}
        onChange={(processorId) => setSearchParams({ processorId })}
      />
      <TaskTypesSelect
        defaultOptionName="类型"
        value={searchParams.typeId}
        onChange={(typeId) => setSearchParams({ typeId })}
      />
      <Button onClick={reset} icon={<UndoOutlined />}>
        重置
      </Button>
    </Row>
  );
};
