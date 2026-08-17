import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input, Typography } from "antd";
import { useAuth } from "../auth/AuthContext";
import AuthPageLayout from "../components/layout/AuthPageLayout";

const { Title, Paragraph } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const result = login(values.email.trim(), values.password);

    if (!result.success) {
      form.setFields([{ name: "password", errors: [result.error] }]);
      return;
    }
    navigate("/mfa");
    console.log("logged to mfa");
  };

  return (
    <AuthPageLayout>
      <Title level={2}>Sign in</Title>
      <Paragraph type="secondary">Use a demo account to continue.</Paragraph>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="user@example.com" autoComplete="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Continue
          </Button>
        </Form.Item>
      </Form>
      <Paragraph>
        Don't have an account? <Link to="/signup">Create an account</Link>
      </Paragraph>
      <Alert
        type="info"
        showIcon
        title="Demo accounts"
        description={
          <>
            <div>Read-only: reader@example.com / password123</div>
            <div>Read/write: editor@example.com / password123</div>
          </>
        }
      />
    </AuthPageLayout>
  );
};

export default LoginPage;
