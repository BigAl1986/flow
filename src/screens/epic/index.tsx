import { Button, Divider, List, Modal } from "antd";
import { MainContainer, Row } from "components/lib";
import { useProjectById } from "screens/kanban/utils";
import { useDeleteEpic, useEpics } from "utils/epic";
import { useEpicQueryKey, useEpicSearchParams } from "./utils";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTasks } from "utils/task";
import { Link } from "react-router-dom";
import { useState } from "react";
import { EpicModal } from "./epic-modal";

export const Epic = () => {
  const { data: currentProject } = useProjectById();
  const { data: epics } = useEpics(useEpicSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const { mutate: deleteEpic } = useDeleteEpic(useEpicQueryKey());
  const [open, setOpen] = useState(false);

  const startDelete = (id: number) => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除任务组吗？",
      onOk() {
        deleteEpic({ id });
      },
    });
  };

  return (
    <MainContainer>
      <Row between>
        <h1>{currentProject?.name}任务组</h1>
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          创建任务组
        </Button>
      </Row>
      <List
        className="epic-list"
        dataSource={epics}
        itemLayout="vertical"
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between>
                  <span>{epic.name}</span>
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => startDelete(epic.id)}
                  />
                </Row>
              }
              description={
                <div>
                  <div>开始时间：{dayjs(epic.start).format("YYYY-MM-DD")}</div>
                  <div>结束时间：{dayjs(epic.end).format("YYYY-MM-DD")}</div>
                </div>
              }
            />
            <div>
              {tasks
                ?.filter((task) => task.epicId === epic.id)
                .map((task, index) => (
                  <span key={task.id}>
                    {index ? <Divider type="vertical" /> : null}
                    <Link
                      to={`/projects/${currentProject?.id}/kanban?editingTaskId=${task.id}`}
                    >
                      {task.name}
                    </Link>
                  </span>
                ))}
            </div>
          </List.Item>
        )}
      ></List>
      <EpicModal modalOpen={open} close={() => setOpen(false)} />
    </MainContainer>
  );
};
