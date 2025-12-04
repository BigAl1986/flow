import { useQuery } from "react-query";
import { User } from "types";
import { useHttp } from "./http";

export const useUsers = (param?: Partial<User>) => {
  const request = useHttp();

  return useQuery<User[]>(["users", param], () =>
    request("users", { data: param })
  );
};
