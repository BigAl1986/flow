import { Button, Drawer, Form, Input, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { ErrorBox, FormContainer } from "components/lib";
import { useEffect } from "react";
import { useProjectIdInUrl } from "screens/kanban/utils";
import { useAddEpic } from "utils/epic";
import { useEpicQueryKey } from "./utils";

export const EpicModal = ({
  modalOpen,
  close,
}: {
  modalOpen: boolean;
  close: () => void;
}) => {
  const { mutate: addEpic, error, isLoading } = useAddEpic(useEpicQueryKey());
  const projectId = useProjectIdInUrl();
  const [form] = useForm();

  const onFinish = () => addEpic({ ...form.getFieldsValue(), projectId });

  useEffect(() => form.resetFields(), [modalOpen, form]);

  return (
    <Drawer
      forceRender
      width="100%"
      open={modalOpen}
      onClose={() => {
        form.resetFields();
        close();
      }}
    >
      <FormContainer>
        {isLoading ? <Spin size="large" /> : <h1>创建任务组</h1>}
        <ErrorBox error={error} />
        <Form
          form={form}
          layout="vertical"
          style={{ width: "40rem" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入项目名称" }]}
          >
            <Input placeholder="项目名称" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>
    </Drawer>
  );
};
