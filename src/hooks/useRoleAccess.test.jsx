import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "../auth/AuthContext";
import { MOCK_MFA_CODE } from "../auth/mockUser";
import { useRoleAccess } from "./useRoleAccess";

function RoleProbe() {
  const auth = useAuth();
  const { canEdit, isReadOnly } = useRoleAccess();

  return (
    <div>
      <div data-testid="can-edit">{String(canEdit)}</div>
      <div data-testid="read-only">{String(isReadOnly)}</div>
      <button
        type="button"
        onClick={() => auth.login("reader@example.com", "password123")}
      >
        login-reader
      </button>
      <button
        type="button"
        onClick={() => auth.login("editor@example.com", "password123")}
      >
        login-editor
      </button>
      <button type="button" onClick={() => auth.verifyMfa(MOCK_MFA_CODE)}>
        verify
      </button>
    </div>
  );
}

async function completeLogin(label) {
  const user = userEvent.setup();
  render(
    <AuthProvider>
      <RoleProbe />
    </AuthProvider>,
  );
  await user.click(screen.getByRole("button", { name: label }));
  await user.click(screen.getByRole("button", { name: "verify" }));
}

describe("useRoleAccess", () => {
  it("disables edits for the read-only role", async () => {
    await completeLogin("login-reader");

    expect(screen.getByTestId("can-edit")).toHaveTextContent("false");
    expect(screen.getByTestId("read-only")).toHaveTextContent("true");
  });

  it("allows edits for the read-write role", async () => {
    await completeLogin("login-editor");

    expect(screen.getByTestId("can-edit")).toHaveTextContent("true");
    expect(screen.getByTestId("read-only")).toHaveTextContent("false");
  });
});
