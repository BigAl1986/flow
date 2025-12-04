import React from "react";
import { useTaskTypes } from "utils/taskTypes";
import { IdSelect } from "./id-select";

export const TaskTypesSelect = (
  props: React.ComponentProps<typeof IdSelect>
) => {
  const { data } = useTaskTypes();
  return <IdSelect options={data || []} {...props} />;
};
