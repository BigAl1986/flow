import { QueryKey, useMutation, useQuery } from "react-query";
import { Kanban, SortProps } from "types";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useReorderKanbanConfig,
} from "./optimistic-options";

export const useKanbans = (param?: Partial<Kanban>) => {
  const request = useHttp();

  return useQuery<Kanban[]>(["kanbans", param], () =>
    request("kanbans", { data: param })
  );
};

export const useAddKanban = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (param: Partial<Kanban>) =>
      request(`kanbans`, {
        data: param,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteKanban = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (param: Partial<Kanban>) =>
      request(`kanbans/${param.id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};

export const useReorderKanban = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (params: SortProps) =>
      request("kanbans/reorder", {
        data: params,
        method: "POST",
      }),
    useReorderKanbanConfig(queryKey)
  );
};
