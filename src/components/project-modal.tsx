import { Button, Drawer, Form, Input, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import {
  useProjectModal,
  useProjectsQueryKey,
} from "screens/project-list/utils";
import { Project } from "types";
import { useAddProject, useEditProject } from "utils/projects";
import { ErrorBox, FormContainer } from "./lib";
import { UserSelect } from "./user-select";

export const ProjectModal = () => {
  const { projectModalVisible, close, editingProject, isLoading } =
    useProjectModal();
  const title = editingProject ? "编辑项目" : "创建项目";
  const [form] = useForm();

  const useMutateProject = editingProject ? useEditProject : useAddProject;
  const {
    mutateAsync,
    error,
    isLoading: mutateLoading,
  } = useMutateProject(useProjectsQueryKey());
  const onFinish = (values: Partial<Project>) => {
    mutateAsync({
      ...editingProject,
      ...values,
    }).then(() => {
      form.resetFields();
      close();
    });
  };

  useEffect(() => {
    form.setFieldsValue(editingProject || {});
  }, [editingProject, form]);

  return (
    <Drawer
      forceRender
      width="100%"
      open={projectModalVisible}
      onClose={() => {
        form.resetFields();
        close();
      }}
    >
      <FormContainer>
        {isLoading ? <Spin size="large" /> : <h1>{title}</h1>}
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
          <Form.Item
            label="部门"
            name="organization"
            rules={[{ required: true, message: "请输入部门名称" }]}
          >
            <Input placeholder="部门名称" />
          </Form.Item>
          <Form.Item label="负责人" name="personId">
            <UserSelect defaultOptionName="负责人" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={mutateLoading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>
    </Drawer>
  );
};
