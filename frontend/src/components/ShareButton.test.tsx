import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareButton } from "./ShareButton";

describe("ShareButton", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders share button", () => {
    render(<ShareButton quoteId="test-id" />);

    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("copies URL to clipboard when clicked", () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(<ShareButton quoteId="quote-123" />);

    fireEvent.click(screen.getByRole("button"));

    expect(writeTextMock).toHaveBeenCalledWith(
      expect.stringContaining("/quote/quote-123")
    );
  });

  it("shows copied state after click", async () => {
    render(<ShareButton quoteId="test-id" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("has correct aria-label before click", () => {
    render(<ShareButton quoteId="test-id" />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Copy link to quote"
    );
  });

  it("has correct aria-label after copy", async () => {
    render(<ShareButton quoteId="test-id" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Link copied!"
      );
    });
  });
});
