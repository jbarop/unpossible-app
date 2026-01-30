import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import { useAdminAuth } from "../hooks/useAdminAuth";

vi.mock("../hooks/useAdminAuth");

describe("AdminRoute", () => {
  const renderWithRouter = (initialRoute = "/admin/dashboard") => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/admin" element={<div>Login Page</div>} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <div>Protected Content</div>
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it("shows loading state when isLoading is true", () => {
    vi.mocked(useAdminAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    renderWithRouter();

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("redirects to login when not authenticated", () => {
    vi.mocked(useAdminAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    renderWithRouter();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    vi.mocked(useAdminAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    });

    renderWithRouter();

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
