import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CookieBanner } from "./CookieBanner";

describe("CookieBanner", () => {
  const mockOnAccept = vi.fn();
  const mockOnReject = vi.fn();

  const renderBanner = () => {
    return render(
      <MemoryRouter>
        <CookieBanner onAccept={mockOnAccept} onReject={mockOnReject} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    mockOnAccept.mockClear();
    mockOnReject.mockClear();
  });

  it("renders dialog with correct role", () => {
    renderBanner();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders cookie notice title", () => {
    renderBanner();

    expect(screen.getByText("Cookie-Hinweis")).toBeInTheDocument();
  });

  it("renders description text", () => {
    renderBanner();

    expect(
      screen.getByText(/Diese Website verwendet ein Session-Cookie/)
    ).toBeInTheDocument();
  });

  it("renders privacy policy link", () => {
    renderBanner();

    const link = screen.getByRole("link", { name: /mehr erfahren/i });
    expect(link).toHaveAttribute("href", "/privacy");
  });

  it("renders accept button", () => {
    renderBanner();

    expect(
      screen.getByRole("button", { name: /akzeptieren/i })
    ).toBeInTheDocument();
  });

  it("renders reject button", () => {
    renderBanner();

    expect(
      screen.getByRole("button", { name: /ablehnen/i })
    ).toBeInTheDocument();
  });

  it("calls onAccept when accept button is clicked", () => {
    renderBanner();

    fireEvent.click(screen.getByRole("button", { name: /akzeptieren/i }));

    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  it("calls onReject when reject button is clicked", () => {
    renderBanner();

    fireEvent.click(screen.getByRole("button", { name: /ablehnen/i }));

    expect(mockOnReject).toHaveBeenCalledTimes(1);
  });

  it("has correct aria labels for accessibility", () => {
    renderBanner();

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "cookie-banner-title");
    expect(dialog).toHaveAttribute(
      "aria-describedby",
      "cookie-banner-description"
    );
  });
});
