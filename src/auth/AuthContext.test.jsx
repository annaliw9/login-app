import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import { MOCK_MFA_CODE } from "./mockUser";

function AuthProbe() {
  const auth = useAuth();

  return (
    <div>
      <div data-testid="status">
        {auth.isAuthenticated
          ? "authenticated"
          : auth.isMfaPending
            ? "mfa-pending"
            : "guest"}
      </div>
      <div data-testid="role">
        {auth.user?.role ?? auth.pendingUser?.role ?? ""}
      </div>
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
      <button
        type="button"
        onClick={() => auth.login("nobody@example.com", "password123")}
      >
        login-invalid
      </button>
      <button type="button" onClick={() => auth.verifyMfa(MOCK_MFA_CODE)}>
        verify
      </button>
      <button type="button" onClick={() => auth.verifyMfa("000000")}>
        verify-invalid
      </button>
      <button type="button" onClick={() => auth.logout()}>
        logout
      </button>
    </div>
  );
}

function renderAuth() {
  return render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>,
  );
}

describe("AuthProvider", () => {
  it("keeps the user pending until MFA succeeds", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole("button", { name: "login-reader" }));

    expect(screen.getByTestId("status")).toHaveTextContent("mfa-pending");
    expect(screen.getByTestId("role")).toHaveTextContent("read-only");

    await user.click(screen.getByRole("button", { name: "verify" }));

    expect(screen.getByTestId("status")).toHaveTextContent("authenticated");
  });

  it("rejects invalid credentials without starting MFA", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole("button", { name: "login-invalid" }));

    expect(screen.getByTestId("status")).toHaveTextContent("guest");
  });

  it("rejects an incorrect MFA code", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole("button", { name: "login-editor" }));
    await user.click(screen.getByRole("button", { name: "verify-invalid" }));

    expect(screen.getByTestId("status")).toHaveTextContent("mfa-pending");
  });

  it("does not verify MFA without a pending login", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole("button", { name: "verify" }));

    expect(screen.getByTestId("status")).toHaveTextContent("guest");
  });

  it("returns to guest after logout", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole("button", { name: "login-reader" }));
    await user.click(screen.getByRole("button", { name: "verify" }));
    await user.click(screen.getByRole("button", { name: "logout" }));

    expect(screen.getByTestId("status")).toHaveTextContent("guest");
  });
});
