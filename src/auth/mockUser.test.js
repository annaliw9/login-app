import { describe, expect, it } from "vitest";
import { findUser, MOCK_MFA_CODE, mockUsers } from "./mockUser";

describe("findUser", () => {
  it("matches a demo account ignoring email case", () => {
    const user = findUser("READER@example.com", "password123");

    expect(user).toMatchObject({
      email: "reader@example.com",
      role: "read-only",
    });
  });

  it("rejects an unknown password", () => {
    expect(findUser("reader@example.com", "wrong-password")).toBeUndefined();
  });

  it("includes both required roles", () => {
    const roles = mockUsers.map((user) => user.role);
    expect(roles).toEqual(["read-only", "read-write"]);
  });

  it("exposes a 6-digit mock MFA code", () => {
    expect(MOCK_MFA_CODE).toMatch(/^\d{6}$/);
  });
});
