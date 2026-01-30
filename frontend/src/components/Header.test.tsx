import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "./Header";

vi.mock("../hooks/useTheme", () => ({
  useTheme: vi.fn().mockReturnValue({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

describe("Header", () => {
  const renderHeader = (initialRoute = "/") => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Header />
      </MemoryRouter>
    );
  };

  it("renders logo link", () => {
    renderHeader();

    const logo = screen.getByRole("link", { name: /umpossible/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("href", "/");
  });

  it("renders navigation links", () => {
    renderHeader();

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "All Quotes" })).toHaveAttribute(
      "href",
      "/quotes"
    );
  });

  it("renders theme toggle button", () => {
    renderHeader();

    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });

  it("renders mobile menu button", () => {
    renderHeader();

    expect(
      screen.getByRole("button", { name: /toggle menu/i })
    ).toBeInTheDocument();
  });

  it("toggles mobile menu on button click", () => {
    renderHeader();

    const menuButton = screen.getByRole("button", { name: /toggle menu/i });

    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });

  it("closes mobile menu when nav link is clicked", () => {
    renderHeader();

    const menuButton = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const mobileLinks = screen.getAllByRole("link", { name: "Home" });
    fireEvent.click(mobileLinks[1]);

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("applies active styling to current route", () => {
    renderHeader("/quotes");

    const quotesLinks = screen.getAllByRole("link", { name: "All Quotes" });
    expect(quotesLinks[0]).toHaveClass("bg-simpsons-yellow");
  });
});
