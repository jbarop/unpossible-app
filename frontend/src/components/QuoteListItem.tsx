import type { QuoteWithVoted } from "@unpossible/shared";
import { Link } from "react-router-dom";
import { VoteButton } from "./VoteButton";

interface QuoteListItemProps {
  quote: QuoteWithVoted;
  onVote: () => void;
  isVoting?: boolean;
}

export function QuoteListItem({ quote, onVote, isVoting }: QuoteListItemProps) {
  return (
    <article className="card flex flex-col md:flex-row md:items-center gap-4">
      <Link
        to={`/quote/${quote.id}`}
        className="flex-1 hover:text-simpsons-yellow transition-colors"
      >
        <blockquote className="text-lg font-medium">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          Season {quote.season}, Episode {quote.episode}
        </p>
      </Link>

      <div className="flex-shrink-0">
        <VoteButton
          votes={quote.votes}
          hasVoted={quote.hasVoted}
          onVote={onVote}
          disabled={isVoting}
        />
      </div>
    </article>
  );
}
