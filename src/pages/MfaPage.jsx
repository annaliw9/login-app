import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input, Typography } from "antd";
import { useAuth } from "../auth/AuthContext";
import { MOCK_MFA_CODE } from "../auth/mockUser";
import AuthPageLayout from "../components/layout/AuthPageLayout";

const { Title, Paragraph, Text } = Typography;

const MfaPage = () => {
  const navigate = useNavigate();
  const { pendingUser, verifyMfa, logout } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const result = verifyMfa(values.code.trim());

    if (!result.success) {
      form.setFields([{ name: "code", errors: [result.error] }]);
      return;
    }
    navigate("/dashboard");
    console.log("logged to dashboad");
  };

  const handleCancel = () => {
    logout();
    navigate("/login");
  };

  return (
    <AuthPageLayout>
      <Title level={2}>Verify your identity</Title>
      <Paragraph type="secondary">
        Enter the 6-digit code sent to
        <Text strong> {pendingUser?.email}</Text>.
      </Paragraph>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          label="Verification code"
          name="code"
          rules={[
            { required: true, message: "Verification code is required" },
            {
              pattern: /^\d{6}$/,
              message: "Enter a 6-digit verification code",
            },
          ]}
        >
          <Input
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Verify
          </Button>
        </Form.Item>
        <Button block onClick={handleCancel}>
          Back to login
        </Button>
        {/* <Link to="/login">Test: go to login</Link> */}
      </Form>
      <Alert
        style={{ marginTop: 16 }}
        type="info"
        title={`Mock MFA code: ${MOCK_MFA_CODE}`}
      />
    </AuthPageLayout>
  );
};

export default MfaPage;
