import type { QuoteWithVoted } from "@unpossible/shared";
import { ShareButton } from "./ShareButton";
import { VoteButton } from "./VoteButton";

interface QuoteCardProps {
  quote: QuoteWithVoted;
  onVote: () => void;
  isVoting?: boolean;
}

export function QuoteCard({ quote, onVote, isVoting }: QuoteCardProps) {
  return (
    <article className="card max-w-2xl mx-auto">
      <blockquote className="text-2xl md:text-3xl font-heading text-center mb-6 leading-relaxed">
        &ldquo;{quote.text}&rdquo;
      </blockquote>

      <div className="text-center text-[var(--color-text-secondary)] mb-6">
        <span>Season {quote.season}</span>
        <span className="mx-2">&bull;</span>
        <span>Episode {quote.episode}</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <VoteButton
          votes={quote.votes}
          hasVoted={quote.hasVoted}
          onVote={onVote}
          disabled={isVoting}
        />
        <ShareButton quoteId={quote.id} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quotation",
            text: quote.text,
            spokenByCharacter: {
              "@type": "Person",
              name: "Ralph Wiggum",
            },
          }),
        }}
      />
    </article>
  );
}
