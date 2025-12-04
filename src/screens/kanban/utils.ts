import { useCallback, useMemo } from "react";
import { useLocation } from "react-router";
import { useUrlQueryParam } from "utils";
import { useGetProject } from "utils/projects";
import { useGetTask } from "utils/task";

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const projectId = pathname.match(/projects\/(\d+)/)?.[1];

  return Number(projectId);
};

export const useProjectById = () => useGetProject(useProjectIdInUrl());

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() });

export const useKanbanQueryKey = () => ["kanbans", useKanbanSearchParams()];

export const useTaskSearchParams = () => {
  const [param] = useUrlQueryParam(["name", "typeId", "processorId", "tagId"]);
  const projectId = useProjectIdInUrl();

  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: param.name,
    }),
    [projectId, param]
  );
};

export const useTaskQueryKey = () => ["tasks", useTaskSearchParams()];

export const useTaskModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    "editingTaskId",
  ]);
  const { data: editingTask, isLoading } = useGetTask(Number(editingTaskId));

  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId]
  );

  const close = useCallback(() => {
    setEditingTaskId({ editingTaskId: undefined });
  }, [setEditingTaskId]);

  return {
    editingTaskId,
    editingTask,
    startEdit,
    close,
    isLoading,
  };
};
