import type { QuoteWithVoted } from "@unpossible/shared";
import { useEffect, useState } from "react";
import { QuoteCard } from "../components/QuoteCard";
import { SEO } from "../components/SEO";
import { QuoteCardSkeleton } from "../components/Skeleton";
import { useCookieConsentContext } from "../contexts/CookieConsentContext";
import { api } from "../lib/api";

export function Home() {
  const { hasConsent } = useCookieConsentContext();
  const [quote, setQuote] = useState<QuoteWithVoted | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    api.quotes
      .getRandom()
      .then((response) => {
        if (!cancelled) {
          setQuote(response.data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load quote");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchTrigger]);

  const fetchRandomQuote = () => {
    setLoading(true);
    setFetchTrigger((prev) => prev + 1);
  };

  const handleVote = () => {
    if (!quote || quote.hasVoted || !hasConsent) return;
    setIsVoting(true);
    api.quotes
      .vote(quote.id)
      .then((response) => {
        setQuote((prev) =>
          prev ? { ...prev, votes: response.votes, hasVoted: true } : null,
        );
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to vote");
      })
      .finally(() => {
        setIsVoting(false);
      });
  };

  if (loading) {
    return (
      <div className="py-8">
        <QuoteCardSkeleton />
        <div className="text-center mt-8">
          <div className="inline-block h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchRandomQuote} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <p>No quotes found.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <SEO canonicalPath="/" />
      <h1 className="sr-only">Random Ralph Wiggum Quote</h1>

      <QuoteCard quote={quote} onVote={handleVote} isVoting={isVoting} hasConsent={hasConsent} />

      <div className="text-center mt-8">
        <button
          onClick={fetchRandomQuote}
          disabled={loading}
          className="btn-primary text-lg px-8 py-3"
        >
          New Quote
        </button>
      </div>
    </div>
  );
}
