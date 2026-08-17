import { Button, List } from "antd";
import { useRoleAccess } from "../../hooks/useRoleAccess";

const DocumentList = ({ documents }) => {
  const { canEdit } = useRoleAccess();
  return (
    <List
      dataSource={documents}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button key="edit" disabled={!canEdit}>
              Edit
            </Button>,
            <Button key="delete" danger disabled={!canEdit}>
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta title={item.title} description={item.status} />
        </List.Item>
      )}
    />
  );
};

export default DocumentList;
