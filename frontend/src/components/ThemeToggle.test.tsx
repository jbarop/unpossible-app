import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";

vi.mock("../hooks/useTheme");

describe("ThemeToggle", () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  it("renders button with correct aria-label for light mode", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });

  it("renders button with correct aria-label for dark mode", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: /switch to light mode/i })
    ).toBeInTheDocument();
  });

  it("calls toggleTheme when clicked", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("displays moon icon in light mode", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      toggleTheme: mockToggleTheme,
    });

    const { container } = render(<ThemeToggle />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("displays sun icon in dark mode", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark",
      toggleTheme: mockToggleTheme,
    });

    const { container } = render(<ThemeToggle />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("has focus ring styling for accessibility", () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("focus:ring-2");
  });
});
