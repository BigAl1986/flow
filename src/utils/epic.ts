import { QueryKey, useMutation, useQuery } from "react-query";
import { Epic } from "types";
import { useHttp } from "./http";
import { useAddConfig, useDeleteConfig } from "./optimistic-options";

export const useEpics = (param?: Partial<Epic>) => {
  const request = useHttp();

  return useQuery<Epic[]>(["epics", param], () =>
    request("epics", { data: param })
  );
};

export const useAddEpic = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (param: Partial<Epic>) =>
      request(`epics`, {
        data: param,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useDeleteEpic = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (param: Partial<Epic>) =>
      request(`epics/${param.id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
