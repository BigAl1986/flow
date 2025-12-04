import { Button, Modal, Table, TableProps } from "antd";
import { Pin } from "components/pin";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Project, User } from "types";
import { useDeleteProject, useEditProject } from "utils/projects";
import { useProjectModal, useProjectsQueryKey } from "./utils";

interface ListProps extends TableProps<Project> {
  users: User[];
  refresh?: () => void;
}

export const List = ({ users, refresh, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());
  const { editStart } = useProjectModal();
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());

  const confirmDeleteProject = (project: Project) => {
    Modal.confirm({
      title: "确定删除该项目吗？",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteProject(project);
      },
    });
  };

  return (
    <Table
      rowKey="id"
      pagination={false}
      columns={[
        {
          title: <Pin checked disabled />,
          render(value, record) {
            return (
              <Pin
                checked={record.pin}
                onCheckedChange={(pin) => mutate({ ...record, pin })}
              />
            );
          },
        },
        {
          title: "项目名",
          sorter: (pre, next) => pre.name.localeCompare(next.name),
          render(value, record) {
            return <Link to={String(record.id)}>{record.name}</Link>;
          },
        },
        {
          title: "负责人",
          render(value, record) {
            return (
              <span>
                {users.find((user) => user.id === record.personId)?.name ||
                  "unknown"}
              </span>
            );
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "创建时间",
          dataIndex: "created",
          render(value, record) {
            return (
              <span>
                {record.created
                  ? dayjs(record.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, record) {
            return (
              <>
                <Button type="link" onClick={() => editStart(record.id)}>
                  编辑
                </Button>
                <Button
                  danger
                  type="link"
                  onClick={() => confirmDeleteProject(record)}
                >
                  删除
                </Button>
              </>
            );
          },
        },
      ]}
      {...props}
    />
  );
};
