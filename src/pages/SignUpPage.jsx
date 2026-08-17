import { Button, Typography } from "antd";
import { Link } from "react-router-dom";
import AuthPageLayout from "../components/layout/AuthPageLayout";

const { Title, Paragraph } = Typography;

const SignUpPage = () => {
  return (
    <AuthPageLayout>
      <Title level={2}>Create an account</Title>
      <Paragraph type="secondary">
        This demo focuses on login, MFA, and role-based access control. Full
        registration is not implemented.
      </Paragraph>
      <Paragraph>
        Please use one of the demo accounts on the sign-in page.
      </Paragraph>
      <Link to="/login">
        <Button type="primary" block>
          Back to sign in
        </Button>
      </Link>
    </AuthPageLayout>
  );
};

export default SignUpPage;
