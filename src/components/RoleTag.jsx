import { Tag } from "antd";

const RoleTag = ({ role }) => {
  const color = role === "read-write" ? "green" : "gold";
  return <Tag color={color}>{role}</Tag>;
};

export default RoleTag;
