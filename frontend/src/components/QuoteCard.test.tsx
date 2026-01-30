import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuoteCard } from "./QuoteCard";
import type { QuoteWithVoted } from "@unpossible/shared";

const mockQuote: QuoteWithVoted = {
  id: "test-quote-id",
  text: "Me fail English? That's unpossible!",
  season: 6,
  episode: 8,
  votes: 42,
  hasVoted: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

const noop = vi.fn();

describe("QuoteCard", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders quote text", () => {
    render(<QuoteCard quote={mockQuote} onVote={noop} />);

    expect(
      screen.getByText(/Me fail English\? That's unpossible!/)
    ).toBeInTheDocument();
  });

  it("renders season and episode", () => {
    render(<QuoteCard quote={mockQuote} onVote={noop} />);

    expect(screen.getByText("Season 6")).toBeInTheDocument();
    expect(screen.getByText("Episode 8")).toBeInTheDocument();
  });

  it("renders vote count", () => {
    render(<QuoteCard quote={mockQuote} onVote={noop} />);

    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("calls onVote when vote button is clicked", () => {
    const handleVote = vi.fn();
    render(<QuoteCard quote={mockQuote} onVote={handleVote} />);

    fireEvent.click(screen.getByLabelText(/upvote/i));
    expect(handleVote).toHaveBeenCalledTimes(1);
  });

  it("disables vote button when isVoting is true", () => {
    render(<QuoteCard quote={mockQuote} onVote={noop} isVoting={true} />);

    const voteButton = screen.getByLabelText(/upvote/i);
    expect(voteButton).toBeDisabled();
  });

  it("shows voted state when hasVoted is true", () => {
    const votedQuote = { ...mockQuote, hasVoted: true };
    render(<QuoteCard quote={votedQuote} onVote={noop} />);

    expect(screen.getByLabelText(/you voted/i)).toBeInTheDocument();
  });

  it("renders share button", () => {
    render(<QuoteCard quote={mockQuote} onVote={noop} />);

    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("contains JSON-LD structured data", () => {
    render(<QuoteCard quote={mockQuote} onVote={noop} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const jsonLd = JSON.parse(script?.textContent ?? "{}") as {
      "@type": string;
      text: string;
    };
    expect(jsonLd["@type"]).toBe("Quotation");
    expect(jsonLd.text).toBe(mockQuote.text);
  });
});
