import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";
import { MOCK_MFA_CODE } from "./auth/mockUser";
import { renderWithProviders } from "./test/render";

async function signIn(email) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), "password123");
  await user.click(screen.getByRole("button", { name: "Continue" }));
  return user;
}

async function completeMfa(user) {
  await screen.findByRole("heading", { name: "Verify your identity" });
  await user.type(screen.getByLabelText("Verification code"), MOCK_MFA_CODE);
  await user.click(screen.getByRole("button", { name: "Verify" }));
}

describe("authentication flow", () => {
  it("validates empty login fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("shows an error for invalid credentials", async () => {
    renderWithProviders(<App />);
    await signIn("nobody@example.com");

    expect(
      await screen.findByText("Invalid Email or Password"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
  });

  it("sends valid credentials to the MFA step", async () => {
    renderWithProviders(<App />);
    await signIn("reader@example.com");

    expect(
      await screen.findByRole("heading", { name: "Verify your identity" }),
    ).toBeInTheDocument();
  });

  it("rejects an incorrect MFA code", async () => {
    renderWithProviders(<App />);
    const user = await signIn("reader@example.com");

    await screen.findByRole("heading", { name: "Verify your identity" });
    await user.type(screen.getByLabelText("Verification code"), "000000");
    await user.click(screen.getByRole("button", { name: "Verify" }));

    expect(
      await screen.findByText("Invalid verification code"),
    ).toBeInTheDocument();
  });

  it("blocks the dashboard until MFA is complete", async () => {
    renderWithProviders(<App />, { route: "/dashboard" });

    expect(
      await screen.findByRole("heading", { name: "Sign in" }),
    ).toBeInTheDocument();
  });

  it("opens the sign-up screen from login", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole("link", { name: "Create an account" }));

    expect(
      await screen.findByRole("heading", { name: "Create an account" }),
    ).toBeInTheDocument();
  });

  it("shows a read-only dashboard after MFA", async () => {
    renderWithProviders(<App />);
    const user = await signIn("reader@example.com");
    await completeMfa(user);

    expect(
      await screen.findByRole("heading", { name: "Welcome, Reader User" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Read-only access")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create document" })).toBeNull();
    expect(screen.getAllByRole("button", { name: "Edit" })[0]).toBeDisabled();
  });

  it("shows a read-write dashboard after MFA", async () => {
    renderWithProviders(<App />);
    const user = await signIn("editor@example.com");
    await completeMfa(user);

    expect(
      await screen.findByRole("heading", { name: "Welcome, Editor User" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create document" }),
    ).toBeEnabled();
    expect(screen.getAllByRole("button", { name: "Edit" })[0]).toBeEnabled();
  });
});
