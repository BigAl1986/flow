import { QueryKey, useMutation, useQuery } from "react-query";
import { SortProps, Task } from "types";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
  useReorderTaskConfig,
} from "./optimistic-options";

export const useTasks = (param?: Partial<Task>) => {
  const request = useHttp();

  return useQuery<Task[]>(["tasks", param], () =>
    request("tasks", { data: param })
  );
};

export const useEditTask = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (param: Partial<Task>) =>
      request(`tasks/${param.id}`, {
        data: param,
        method: "PATCH",
      }),
    useEditConfig(queryKey)
  );
};

export const useAddTask = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (param: Partial<Task>) =>
      request(`tasks`, {
        data: param,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useGetTask = (id?: number) => {
  const request = useHttp();

  return useQuery<Task>(["task", { id }], () => request(`tasks/${id}`), {
    enabled: !!id,
  });
};

export const useDeleteTask = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (param: Partial<Task>) =>
      request(`tasks/${param.id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};

export const useReorderTask = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (params: SortProps) =>
      request("tasks/reorder", {
        data: params,
        method: "POST",
      }),
    useReorderTaskConfig(queryKey)
  );
};
