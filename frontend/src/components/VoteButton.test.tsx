import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VoteButton } from "./VoteButton";

const noop = vi.fn();

describe("VoteButton", () => {
  it("renders vote count", () => {
    render(<VoteButton votes={42} hasVoted={false} onVote={noop} />);

    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("calls onVote when clicked", () => {
    const handleVote = vi.fn();
    render(<VoteButton votes={10} hasVoted={false} onVote={handleVote} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleVote).toHaveBeenCalledTimes(1);
  });

  it("is disabled when hasVoted is true", () => {
    render(<VoteButton votes={5} hasVoted={true} onVote={noop} />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <VoteButton votes={5} hasVoted={false} onVote={noop} disabled={true} />
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("has correct aria-label when not voted", () => {
    render(<VoteButton votes={15} hasVoted={false} onVote={noop} />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Upvote - 15 votes"
    );
  });

  it("has correct aria-label when voted", () => {
    render(<VoteButton votes={15} hasVoted={true} onVote={noop} />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "You voted - 15 votes"
    );
  });

  it("does not call onVote when disabled", () => {
    const handleVote = vi.fn();
    render(<VoteButton votes={10} hasVoted={true} onVote={handleVote} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleVote).not.toHaveBeenCalled();
  });

  it("applies different styling when voted", () => {
    const { rerender } = render(
      <VoteButton votes={10} hasVoted={false} onVote={noop} />
    );

    const buttonNotVoted = screen.getByRole("button");
    expect(buttonNotVoted).toHaveClass("bg-simpsons-sky");

    rerender(<VoteButton votes={10} hasVoted={true} onVote={noop} />);

    const buttonVoted = screen.getByRole("button");
    expect(buttonVoted).toHaveClass("bg-simpsons-pink");
  });
});
