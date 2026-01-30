import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuoteModal } from "./QuoteModal";

describe("QuoteModal", () => {
  const defaultProps = {
    isOpen: true,
    title: "Add Quote",
    onSubmit: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onSubmit.mockClear();
    defaultProps.onClose.mockClear();
  });

  it("renders nothing when isOpen is false", () => {
    render(<QuoteModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog when isOpen is true", () => {
    render(<QuoteModal {...defaultProps} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders title", () => {
    render(<QuoteModal {...defaultProps} />);

    expect(screen.getByText("Add Quote")).toBeInTheDocument();
  });

  it("renders close button", () => {
    render(<QuoteModal {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /close modal/i })
    ).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<QuoteModal {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /close modal/i }));

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    render(<QuoteModal {...defaultProps} />);

    const backdrop = screen.getByRole("dialog").querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop!);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    render(<QuoteModal {...defaultProps} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when isLoading", () => {
    render(<QuoteModal {...defaultProps} isLoading={true} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(defaultProps.onClose).not.toHaveBeenCalled();

    const backdrop = screen.getByRole("dialog").querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop!);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("disables close button when isLoading", () => {
    render(<QuoteModal {...defaultProps} isLoading={true} />);

    expect(
      screen.getByRole("button", { name: /close modal/i })
    ).toBeDisabled();
  });

  it("renders QuoteForm inside modal", () => {
    render(<QuoteModal {...defaultProps} />);

    expect(screen.getByLabelText(/quote text/i)).toBeInTheDocument();
  });

  it("passes initialData to QuoteForm", () => {
    render(
      <QuoteModal
        {...defaultProps}
        initialData={{ text: "Test quote", season: 5, episode: 10 }}
      />
    );

    expect(screen.getByLabelText(/quote text/i)).toHaveValue("Test quote");
  });

  it("has correct aria attributes", () => {
    render(<QuoteModal {...defaultProps} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "quote-modal-title");
  });
});
