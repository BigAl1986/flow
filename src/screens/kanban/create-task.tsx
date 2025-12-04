import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useAddTask } from "utils/task";
import { TaskCard } from "./kanban-column";
import { useProjectIdInUrl, useTaskQueryKey } from "./utils";
import { PlusOutlined } from "@ant-design/icons";

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState("");
  const { mutateAsync: addTask } = useAddTask(useTaskQueryKey());
  const projectId = useProjectIdInUrl();
  const [inputting, setInputting] = useState(false);

  const submit = () => {
    addTask({ name, projectId, kanbanId }).then(() => {
      setInputting(false);
      setName("");
    });
  };

  const toggleInputting = () => setInputting(!inputting);

  useEffect(() => {
    if (!inputting) setName("");
  }, [inputting]);

  if (!inputting)
    return (
      <Button
        type="link"
        size="small"
        icon={<PlusOutlined />}
        onClick={toggleInputting}
      >
        创建任务
      </Button>
    );

  return (
    <TaskCard>
      <Input
        onBlur={toggleInputting}
        placeholder="任务名"
        autoFocus
        onPressEnter={submit}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </TaskCard>
  );
};
