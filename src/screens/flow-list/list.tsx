import { Button, Input, Modal, Table, TableProps } from "antd";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { UserSelect } from "components/user-select";
import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Flow, User } from "types";
import { genRandomId } from "screens/comfy/libs/utils";

interface ListProps extends TableProps<Flow> {
  users: User[];
  onDelete: (id: string) => void;
  onSave: (flow: Flow) => void;
  onCancel: () => void;
  refresh?: () => void;
}

export const List = ({ users, refresh, ...props }: ListProps) => {
  const [addingRow, setAddingRow] = useState<Flow>({
    id: 'new',
    name: '',
    personId: 1,
    organization: '',
    created: new Date().getTime(),
  });
  const saveDisabled = addingRow.name.trim() === '';

  const confirmDeleteProject = (flow: Flow) => {
    Modal.confirm({
      title: "确定删除该流程吗？",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        props.onDelete(flow.id);
      },
    });
  };
  const handleCancel = () => {
    props.onCancel();
    setAddingRow({
      id: 'new',
      name: '',
      personId: 1,
      organization: '',
      created: new Date().getTime(),
    });
  }

  return (
    <Table
      rowKey="id"
      pagination={false}
      columns={[
        {
          title: "流程名",
          sorter: (pre, next) => pre.name.localeCompare(next.name),
          render(value, record) {
            return record.id === 'new' ?
            <Input
              allowClear
              value={addingRow.name}
              onChange={e => setAddingRow({
                ...addingRow,
                name: e.target.value,
              })}
            /> :
            <Link to={`/comfy/${String(record.id)}`}>{record.name}</Link>;
          },
        },
        {
          title: "负责人",
          render(value, record) {
            return (
              record.id === 'new' ?
              <UserSelect
                defaultOptionName="负责人"
                value={addingRow.personId}
                onChange={(e) =>
                  setAddingRow({
                    ...addingRow,
                    personId: e || 1,
                  })
                }
              /> :
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
          render(value, record) {
            return (
              record.id === 'new' ?
              <Input
                allowClear
                value={addingRow.organization}
                onChange={e => setAddingRow({
                  ...addingRow,
                  organization: e.target.value,
                })}
              /> :
              <span>{record.organization}</span>
            );
          }
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
              record.id === 'new' ?
              <>
                <Button
                  type="link"
                  disabled={saveDisabled}
                  icon={<CheckOutlined />}
                  onClick={() => props.onSave({
                    ...addingRow,
                    id: genRandomId(),
                    created: new Date().getTime(),
                  })}
                />
                <Button
                  danger
                  type="link"
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                />
              </>
              :
              <Button
                danger
                type="link"
                onClick={() => confirmDeleteProject(record)}
              >
                删除
              </Button>
            );
          },
        },
      ]}
      {...props}
    />
  );
};
