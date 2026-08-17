import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthProvider } from "../auth/AuthContext";

export function renderWithProviders(ui, { route = "/login" } = {}) {
  return render(
    <ConfigProvider>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>{ui}</AuthProvider>
      </MemoryRouter>
    </ConfigProvider>,
  );
}
