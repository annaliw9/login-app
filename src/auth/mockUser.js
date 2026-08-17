export const MOCK_MFA_CODE = "121316";

export const mockUsers = [
  {
    email: "reader@example.com",
    password: "password123",
    name: "Reader User",
    role: "read-only",
  },
  {
    email: "editor@example.com",
    password: "password123",
    name: "Editor User",
    role: "read-write",
  },
];

export function findUser(email, password) {
  return mockUsers.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password,
  );
}
