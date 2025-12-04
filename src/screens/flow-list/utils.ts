import { useCallback, useMemo } from "react";
import { useUrlQueryParam } from "utils";
import { useGetProject } from "utils/projects";

export const useProjectsSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(
    useMemo(() => ["name", "personId"], [])
  );
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectsQueryKey = () => {
  const [param] = useProjectsSearchParams();
  return ["projects", param];
};

export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);
  const [{ projectEditId }, setProjectEditId] = useUrlQueryParam([
    "projectEditId",
  ]);

  const { data: editingProject, isLoading } = useGetProject(
    Number(projectEditId)
  );

  const open = useCallback(
    () => setProjectCreate({ projectCreate: true }),
    [setProjectCreate]
  );
  const close = useCallback(() => {
    editingProject
      ? setProjectEditId({ projectEditId: undefined })
      : setProjectCreate({ projectCreate: undefined });
  }, [setProjectEditId, setProjectCreate, editingProject]);

  const editStart = useCallback(
    (id: number) => setProjectEditId({ projectEditId: id }),
    [setProjectEditId]
  );

  return {
    projectModalVisible: !!projectCreate || !!projectEditId,
    open,
    close,
    editStart,
    editingProject,
    isLoading,
  };
};
