import type { QuoteWithVoted } from "@unpossible/shared";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QuoteCard } from "../components/QuoteCard";
import { useCookieConsentContext } from "../contexts/CookieConsentContext";
import { api } from "../lib/api";

export function QuoteDetail() {
  const { hasConsent } = useCookieConsentContext();
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<QuoteWithVoted | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    api.quotes
      .getById(id)
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
  }, [id]);

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <p className="mb-4">Quote not found.</p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <QuoteCard quote={quote} onVote={handleVote} isVoting={isVoting} hasConsent={hasConsent} />

      <div className="text-center mt-8">
        <Link to="/" className="btn-secondary">
          Get a Random Quote
        </Link>
      </div>
    </div>
  );
}
