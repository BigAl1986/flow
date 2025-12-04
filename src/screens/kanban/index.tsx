import styled from "@emotion/styled";
import { Spin } from "antd";
import { Drag, Drop, DropChild } from "components/drag-and-drop";
import { MainContainer } from "components/lib";
import { useCallback } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useDebounce, useDocumentTitle } from "utils";
import { useKanbans, useReorderKanban } from "utils/kanban";
import { useReorderTask, useTasks } from "utils/task";
import { CreateKanban } from "./create-kanban";
import { KanbanColumn } from "./kanban-column";
import { SearchPanel } from "./search-panel";
import { TaskModal } from "./task-modal";
import {
  useKanbanQueryKey,
  useKanbanSearchParams,
  useProjectById,
  useTaskQueryKey,
  useTaskSearchParams,
} from "./utils";

export const Kanban = () => {
  useDocumentTitle("看板列表");

  const { data: currentProject } = useProjectById();
  const { data: kanbans, isLoading: kanbansIsLoading } = useKanbans(
    useDebounce(useKanbanSearchParams(), 500)
  );
  const { isLoading: taskIsLoading } = useTasks(
    useDebounce(useTaskSearchParams(), 500)
  );
  const isLoading = kanbansIsLoading || taskIsLoading;

  const onDragEnd = useDragEnd();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <MainContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <ColumnContainer>
            <Drop type="COLUMN" direction="horizontal" droppableId="kanban">
              <DropChild style={{ display: "flex" }}>
                {kanbans?.map((kanban, index) => (
                  <Drag
                    key={kanban.id}
                    draggableId={`kanban_${kanban.id}`}
                    index={index}
                  >
                    <KanbanColumn key={kanban.id} kanban={kanban} />
                  </Drag>
                ))}
              </DropChild>
            </Drop>
            <CreateKanban />
          </ColumnContainer>
        )}
        <TaskModal />
      </MainContainer>
    </DragDropContext>
  );
};

const ColumnContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { mutate: reorderKanbans } = useReorderKanban(useKanbanQueryKey());
  const { data: tasks } = useTasks(useKanbanSearchParams());
  const { mutate: reorderTasks } = useReorderTask(useTaskQueryKey());

  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) return;

      if (type === "COLUMN") {
        const fromId = kanbans?.[source.index].id;
        const referenceId = kanbans?.[destination.index].id;
        if (!fromId || !referenceId || fromId === referenceId) return;
        const type = destination.index > source.index ? "after" : "before";
        reorderKanbans({ fromId, referenceId, type });
      }
      if (type === "ROW") {
        const fromKanbanId = Number(source.droppableId);
        const toKanbanId = Number(destination.droppableId);
        const fromTask = tasks?.filter(
          (task) => task.kanbanId === fromKanbanId
        )[source.index];
        const referenceTask = tasks?.filter(
          (task) => task.kanbanId === toKanbanId
        )[destination.index];
        if (fromTask?.id === referenceTask?.id) return;
        const type =
          fromKanbanId === toKanbanId && destination.index > source.index
            ? "after"
            : "before";
        reorderTasks({
          fromId: fromTask?.id,
          referenceId: referenceTask?.id,
          fromKanbanId,
          toKanbanId,
          type,
        });
      }
    },
    [kanbans, reorderKanbans, tasks, reorderTasks]
  );
};
