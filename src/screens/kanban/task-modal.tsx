import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { TaskTypesSelect } from "components/taskType-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useDeleteTask, useEditTask } from "utils/task";
import { useTaskModal, useTaskQueryKey } from "./utils";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const TaskModal = () => {
  const [form] = useForm();
  const { editingTaskId, editingTask, close } = useTaskModal();
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(
    useTaskQueryKey()
  );

  const onCancel = () => {
    close();
    form.resetFields();
  };

  const onOk = () =>
    editTask({ ...editingTask, ...form.getFieldsValue() }).then(() =>
      onCancel()
    );

  const { mutateAsync: deleteTask } = useDeleteTask(useTaskQueryKey());

  const startDelete = () => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: "确定删除看板吗？",
      onOk() {
        deleteTask({ id: Number(editingTaskId) }).then(() => onCancel());
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [editingTask, form]);

  return (
    <Modal
      forceRender
      open={!!editingTaskId}
      onCancel={onCancel}
      cancelText="取消"
      onOk={onOk}
      okText="提交"
      title="编辑任务"
      confirmLoading={editLoading}
      transitionName=""
      maskTransitionName=""
    >
      <Form {...layout} initialValues={editingTask} form={form}>
        <Form.Item
          label="任务名"
          name="name"
          rules={[{ required: true, message: "请输入任务名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="经办人" name="processorId">
          <UserSelect />
        </Form.Item>
        <Form.Item label="类型" name="typeId">
          <TaskTypesSelect />
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button size="small" danger onClick={startDelete}>
            删除
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
