import { useNavigate } from "react-router-dom";
import { Button, Card, Space, Typography } from "antd";
import { useAuth } from "../auth/AuthContext";
import RoleTag from "../components/RoleTag";
import DocumentList from "../components/dashboard/DocumentList";
import { useRoleAccess } from "../hooks/useRoleAccess";

const { Title, Text, Paragraph } = Typography;

const documents = [
  { id: 1, title: "Document 1", status: "Draft" },

  {
    id: 2,
    title: "Document 2",
    status: "In Review",
  },
  {
    id: 3,
    title: "Document 3",
    status: "Published",
  },
  {
    id: 4,
    title: "Document 4",
    status: "Draft",
  },
  {
    id: 5,
    title: "Document 5",
    status: "In Review",
  },
];

const DashboardPage = () => {
  const { logout } = useAuth();
  const { user, canEdit } = useRoleAccess();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page dashboard-page">
      <div style={{ width: "min(100%, 860px)" }}>
        <Card style={{ marginBottom: 24 }}>
          <Space
            style={{ width: "100%", justifyContent: "space-between" }}
            align="start"
          >
            <div>
              <Text type="secondary">PROTECTED AREA</Text>
              <Title level={2} style={{ marginTop: 8 }}>
                Welcome, {user.name}
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Signed in as {user.email} · Role: <RoleTag role={user.role} />
              </Paragraph>
            </div>
            <Button onClick={handleLogout}>Sign out</Button>
          </Space>
        </Card>
        <Card
          title="Documents"
          extra={
            canEdit ? (
              <Button type="primary">Create document</Button>
            ) : (
              <Text type="secondary">Read-only access</Text>
            )
          }
        >
          <DocumentList documents={documents} />
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
