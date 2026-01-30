import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuoteForm } from "./QuoteForm";

describe("QuoteForm", () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onSubmit.mockClear();
    defaultProps.onCancel.mockClear();
  });

  it("renders empty form for new quote", () => {
    render(<QuoteForm {...defaultProps} />);

    expect(screen.getByLabelText(/quote text/i)).toHaveValue("");
    expect(screen.getByLabelText(/season/i)).toHaveValue(null);
    expect(screen.getByLabelText(/episode/i)).toHaveValue(null);
  });

  it("renders pre-filled form when initialData is provided", () => {
    render(
      <QuoteForm
        {...defaultProps}
        initialData={{ text: "Test quote", season: 5, episode: 10 }}
      />
    );

    expect(screen.getByLabelText(/quote text/i)).toHaveValue("Test quote");
    expect(screen.getByLabelText(/season/i)).toHaveValue(5);
    expect(screen.getByLabelText(/episode/i)).toHaveValue(10);
  });

  it("shows Create Quote button for new quote", () => {
    render(<QuoteForm {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /create quote/i })
    ).toBeInTheDocument();
  });

  it("shows Update Quote button when editing", () => {
    render(
      <QuoteForm
        {...defaultProps}
        initialData={{ text: "Test", season: 1, episode: 1 }}
      />
    );

    expect(
      screen.getByRole("button", { name: /update quote/i })
    ).toBeInTheDocument();
  });

  it("calls onSubmit with form data on valid submission", () => {
    render(<QuoteForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/quote text/i), {
      target: { value: "Test quote text" },
    });
    fireEvent.change(screen.getByLabelText(/season/i), {
      target: { value: "6" },
    });
    fireEvent.change(screen.getByLabelText(/episode/i), {
      target: { value: "8" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create quote/i }));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      text: "Test quote text",
      season: 6,
      episode: 8,
    });
  });

  it("trims whitespace from quote text", () => {
    render(<QuoteForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/quote text/i), {
      target: { value: "  Test quote  " },
    });
    fireEvent.change(screen.getByLabelText(/season/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/episode/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create quote/i }));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ text: "Test quote" })
    );
  });

  it("shows error when quote text is empty", () => {
    render(<QuoteForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/season/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/episode/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create quote/i }));

    expect(screen.getByText(/quote text is required/i)).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("shows error when season is invalid", () => {
    render(<QuoteForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/quote text/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/episode/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create quote/i }));

    expect(
      screen.getByText(/valid season number is required/i)
    ).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("shows error when episode is invalid", () => {
    render(<QuoteForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/quote text/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/season/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create quote/i }));

    expect(
      screen.getByText(/valid episode number is required/i)
    ).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<QuoteForm {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("disables form when isLoading is true", () => {
    render(<QuoteForm {...defaultProps} isLoading={true} />);

    expect(screen.getByLabelText(/quote text/i)).toBeDisabled();
    expect(screen.getByLabelText(/season/i)).toBeDisabled();
    expect(screen.getByLabelText(/episode/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("shows character count", () => {
    render(<QuoteForm {...defaultProps} />);

    expect(screen.getByText("0/1000 characters")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/quote text/i), {
      target: { value: "Hello" },
    });

    expect(screen.getByText("5/1000 characters")).toBeInTheDocument();
  });
});
