import { QueryKey, useQueryClient } from "react-query";
import { Task } from "types";
import { reorder } from "./reorder";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, dataSource?: any[]) => any[]
) => {
  const queryClient = useQueryClient();

  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (dataSource?: any[]) => {
        return callback(target, dataSource);
      });
      return { previousItems };
    },
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, dataSource) =>
      dataSource?.filter((data) => data.id !== target.id) || []
  );

export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, dataSource) =>
      dataSource?.map((data) =>
        data.id === target.id
          ? {
              ...data,
              ...target,
            }
          : data
      ) || []
  );

export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, dataSource) =>
      dataSource ? [...dataSource, { ...target, id: 0 }] : [] // 这里新增项目的id为0是为了不引起渲染时缺少key，绝大部分的列表渲染key都为id。
  );

export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    const orderedList = reorder({ list: old, ...target }) as Task[];
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });
