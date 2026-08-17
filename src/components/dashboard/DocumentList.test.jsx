import { render, screen } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "../../auth/AuthContext";
import { MOCK_MFA_CODE } from "../../auth/mockUser";
import DocumentList from "./DocumentList";

const documents = [{ id: 1, title: "Sales Report", status: "Draft" }];

function SeedSession({ email, children }) {
  const { login, verifyMfa, isAuthenticated, isMfaPending } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      login(email, "password123");
    }
  }, [email, login]);

  useEffect(() => {
    if (isMfaPending) verifyMfa(MOCK_MFA_CODE);
  }, [isMfaPending, verifyMfa]);

  if (!isAuthenticated) return null;
  return children;
}

function renderDocuments(email) {
  return render(
    <AuthProvider>
      <SeedSession email={email}>
        <DocumentList documents={documents} />
      </SeedSession>
    </AuthProvider>,
  );
}

describe("DocumentList", () => {
  it("disables edit actions for a read-only user", async () => {
    renderDocuments("reader@example.com");

    expect(await screen.findByRole("button", { name: "Edit" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });

  it("enables edit actions for a read-write user", async () => {
    renderDocuments("editor@example.com");

    expect(await screen.findByRole("button", { name: "Edit" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
  });
});
