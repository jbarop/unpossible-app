import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Footer } from "./Footer";

describe("Footer", () => {
  const renderFooter = () => {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  };

  it("renders Ralph Wiggum quote", () => {
    renderFooter();

    expect(screen.getByText(/That's unpossible!/)).toBeInTheDocument();
    expect(screen.getByText(/Ralph Wiggum/)).toBeInTheDocument();
  });

  it("renders privacy policy link", () => {
    renderFooter();

    const privacyLink = screen.getByRole("link", { name: /privacy policy/i });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });
});
