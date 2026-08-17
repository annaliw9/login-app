import { render, screen } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "../auth/AuthContext";
import { MOCK_MFA_CODE } from "../auth/mockUser";
import { GuestRoute, MfaRoute, ProtectedRoute } from "./ProtectedRoute";

function SeedAuth({ email, verify = false }) {
  const { login, verifyMfa, isMfaPending } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      login(email, "password123");
    }
  }, [email, login]);

  useEffect(() => {
    if (verify && isMfaPending) verifyMfa(MOCK_MFA_CODE);
  }, [isMfaPending, verify, verifyMfa]);

  return null;
}

function GuardApp({ route, email, verify = false }) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        {email ? <SeedAuth email={email} verify={verify} /> : null}
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>login-screen</div>} />
          </Route>
          <Route element={<MfaRoute />}>
            <Route path="/mfa" element={<div>mfa-screen</div>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>dashboard-screen</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("route guards", () => {
  it("sends logged-out users away from MFA and the dashboard", async () => {
    GuardApp({ route: "/mfa" });
    expect(await screen.findByText("login-screen")).toBeInTheDocument();
  });

  it("keeps a pending MFA user on the MFA route", async () => {
    GuardApp({ route: "/mfa", email: "reader@example.com" });
    expect(await screen.findByText("mfa-screen")).toBeInTheDocument();
  });

  it("redirects a pending MFA user from login back to MFA", async () => {
    GuardApp({ route: "/login", email: "reader@example.com" });
    expect(await screen.findByText("mfa-screen")).toBeInTheDocument();
  });

  it("lets an authenticated user open the dashboard", async () => {
    GuardApp({
      route: "/dashboard",
      email: "editor@example.com",
      verify: true,
    });
    expect(await screen.findByText("dashboard-screen")).toBeInTheDocument();
  });

  it("sends an authenticated user away from login", async () => {
    GuardApp({
      route: "/login",
      email: "editor@example.com",
      verify: true,
    });
    expect(await screen.findByText("dashboard-screen")).toBeInTheDocument();
  });
});
