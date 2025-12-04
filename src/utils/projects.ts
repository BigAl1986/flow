import { QueryKey, useMutation, useQuery } from "react-query";
import { Project } from "types";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./optimistic-options";

export const useProjects = (param?: Partial<Project>) => {
  const request = useHttp();

  return useQuery<Project[]>(["projects", param], () =>
    request("projects", { data: param })
  );
};

export const useEditProject = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (param: Partial<Project>) =>
      request(`projects/${param.id}`, {
        data: param,
        method: "PATCH",
      }),
    useEditConfig(queryKey)
  );
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (param: Partial<Project>) =>
      request(`projects/${param.id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};

export const useAddProject = (queryKey: QueryKey) => {
  const request = useHttp();

  return useMutation(
    (param: Partial<Project>) =>
      request(`projects`, {
        data: param,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useGetProject = (id?: number) => {
  const request = useHttp();

  return useQuery<Project>(
    ["project", { id }],
    () => request(`projects/${id}`),
    { enabled: !!id }
  );
};
