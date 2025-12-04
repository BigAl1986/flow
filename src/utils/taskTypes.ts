import { useQuery } from "react-query";
import { TaskType } from "types";
import { useHttp } from "./http";

export const useTaskTypes = (param?: Partial<TaskType>) => {
  const request = useHttp();

  return useQuery<TaskType[]>(["taskTypes", param], () =>
    request("taskTypes", { data: param })
  );
};
