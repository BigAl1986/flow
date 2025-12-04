import { Kanban } from "types";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/taskTypes";
import { useKanbanQueryKey, useTaskModal, useTaskSearchParams } from "./utils";
import { ReactComponent as TaskIcon } from "assets/task.svg";
import { ReactComponent as BugIcon } from "assets/bug.svg";
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { CreateTask } from "./create-task";
import { useDebounce } from "utils";
import { MarkName } from "components/mark-name";
import { useDeleteKanban } from "utils/kanban";
import { Row } from "components/lib";
import React from "react";
import { Drag, Drop, DropChild } from "components/drag-and-drop";

export const KanbanColumn = React.forwardRef<
  HTMLDivElement,
  { kanban: Kanban }
>(({ kanban, ...props }, ref) => {
  const { data: allTasks } = useTasks(useDebounce(useTaskSearchParams(), 500));
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  const { startEdit } = useTaskModal();
  const { name: keyword } = useTaskSearchParams();

  return (
    <KanbanContainer {...props} ref={ref}>
      <Row between>
        <h3>{kanban.name}</h3>
        <MoreActions kanban={kanban} key={kanban.id} />
      </Row>
      <TaskContainer>
        <Drop type="ROW" direction="vertical" droppableId={String(kanban.id)}>
          <DropChild style={{ minHeight: "5px" }}>
            {tasks?.map((task, index) => (
              <Drag key={task.id} index={index} draggableId={`task_${task.id}`}>
                <TaskCard
                  key={task.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => startEdit(task.id)}
                >
                  <TaskTypeIcon id={task.typeId} />
                  <MarkName keyword={keyword} name={task.name} />
                </TaskCard>
              </Drag>
            ))}
          </DropChild>
        </Drop>
        <CreateTask kanbanId={kanban.id} />
      </TaskContainer>
    </KanbanContainer>
  );
});

const MoreActions = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync: deleteKanban } = useDeleteKanban(useKanbanQueryKey());
  const startDelete = () => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除看板吗？",
      onOk() {
        deleteKanban({ id: kanban.id });
      },
    });
  };
  const overlay = (
    <Menu>
      <Menu.Item>
        <Button type="link" onClick={startDelete}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={overlay}>
      <Button type="link">...</Button>
    </Dropdown>
  );
};

export const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;

  if (name === "task") return <TaskIcon />;
  if (name === "bug") return <BugIcon />;
  return null;
};

export const TaskCard = styled(Card)`
  margin-bottom: 0.5rem;
  > div {
    display: flex;
    align-items: center;
    line-height: 100%;
  }
`;

export const KanbanContainer = styled.div`
  min-width: 20rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

export const TaskContainer = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
