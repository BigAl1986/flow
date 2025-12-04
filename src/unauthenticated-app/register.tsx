import { Form, Input } from "antd";
import { useAuth } from "context/auth-context";
import { LongButton } from "unauthenticated-app";

export const Register = ({ onError }: { onError: (error: Error) => void }) => {
  const { register } = useAuth();

  const handleSubmit = ({
    checkPassword,
    ...value
  }: {
    username: string;
    password: string;
    checkPassword: string;
  }) => {
    if (checkPassword !== value.password) {
      onError(new Error("请确认两次输入的密码相同"));
      return;
    }
    register(value).catch((err) => onError(err));
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input type="text" placeholder="用户名" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input type="password" placeholder="密码" />
      </Form.Item>
      <Form.Item
        name="checkPassword"
        rules={[{ required: true, message: "请确认密码" }]}
      >
        <Input type="password" placeholder="确认密码" />
      </Form.Item>
      <Form.Item>
        <LongButton type="primary" htmlType="submit">
          注册
        </LongButton>
      </Form.Item>
    </Form>
  );
};
