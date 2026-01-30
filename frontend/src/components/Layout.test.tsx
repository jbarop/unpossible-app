import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Layout } from "./Layout";

vi.mock("../contexts/CookieConsentContext", () => ({
  useCookieConsentContext: vi.fn().mockReturnValue({
    showBanner: false,
    acceptCookies: vi.fn(),
    rejectCookies: vi.fn(),
  }),
}));

vi.mock("../hooks/useTheme", () => ({
  useTheme: vi.fn().mockReturnValue({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

import { useCookieConsentContext } from "../contexts/CookieConsentContext";

describe("Layout", () => {
  const renderLayout = () => {
    return render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
  };

  it("renders header", () => {
    renderLayout();

    expect(screen.getByText("Umpossible")).toBeInTheDocument();
  });

  it("renders footer", () => {
    renderLayout();

    expect(screen.getByText(/Ralph Wiggum/)).toBeInTheDocument();
  });

  it("renders skip link", () => {
    renderLayout();

    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
  });

  it("renders main content area with correct id", () => {
    renderLayout();

    expect(document.getElementById("main-content")).toBeInTheDocument();
  });

  it("does not render cookie banner when showBanner is false", () => {
    renderLayout();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders cookie banner when showBanner is true", () => {
    vi.mocked(useCookieConsentContext).mockReturnValue({
      showBanner: true,
      acceptCookies: vi.fn(),
      rejectCookies: vi.fn(),
      consentStatus: "pending",
      hasConsent: false,
    });

    renderLayout();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Cookie-Hinweis")).toBeInTheDocument();
  });
});
