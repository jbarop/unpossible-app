import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("renders skip link", () => {
    render(<SkipLink />);

    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
  });

  it("links to main-content id", () => {
    render(<SkipLink />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("has sr-only class for screen reader accessibility", () => {
    render(<SkipLink />);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("sr-only");
  });

  it("has focus styling to become visible on focus", () => {
    render(<SkipLink />);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("focus:not-sr-only");
  });
});
