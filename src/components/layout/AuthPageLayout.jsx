import { Card } from "antd";

const AuthPageLayout = ({ children, width = 420 }) => {
  return (
    <div className="page">
      <Card style={{ width }}>{children}</Card>
    </div>
  );
};

export default AuthPageLayout;
