import { Input } from "antd";
import { useState } from "react";
import { useAddKanban } from "utils/kanban";
import { KanbanContainer, TaskContainer } from "./kanban-column";
import { useKanbanQueryKey, useProjectIdInUrl } from "./utils";

export const CreateKanban = () => {
  const [name, setName] = useState("");
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addKanban } = useAddKanban(useKanbanQueryKey());

  const submit = () => {
    addKanban({ name, projectId }).then(() => setName(""));
  };

  return (
    <KanbanContainer>
      <h3>新建看板</h3>
      <TaskContainer>
        <Input
          size="large"
          placeholder="看板名称"
          onPressEnter={submit}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </TaskContainer>
    </KanbanContainer>
  );
};
