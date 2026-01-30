import type { QuoteListParams, QuoteWithVoted } from "@unpossible/shared";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QuoteListItem } from "../components/QuoteListItem";
import { useCookieConsentContext } from "../contexts/CookieConsentContext";
import { api } from "../lib/api";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function Quotes() {
  const { hasConsent } = useCookieConsentContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quotes, setQuotes] = useState<QuoteWithVoted[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const seasonParam = searchParams.get("season");
  const season = seasonParam ? Number(seasonParam) : undefined;
  const episodeParam = searchParams.get("episode");
  const episode = episodeParam ? Number(episodeParam) : undefined;
  const sortParam = searchParams.get("sort");
  const sort =
    sortParam === "votes_asc" || sortParam === "votes_desc"
      ? sortParam
      : undefined;
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number(pageParam) : 1;

  useEffect(() => {
    let cancelled = false;

    const params: QuoteListParams = {
      season,
      episode,
      sort,
      page,
      limit: 20,
    };
    api.quotes
      .getList(params)
      .then((response) => {
        if (!cancelled) {
          setQuotes(response.data);
          setPagination(response.pagination);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load quotes",
          );
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
  }, [season, episode, sort, page, fetchTrigger]);

  const refetchQuotes = () => {
    setLoading(true);
    setFetchTrigger((prev) => prev + 1);
  };

  const handleVote = (quoteId: string) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote || quote.hasVoted || !hasConsent) return;
    setVotingId(quoteId);
    api.quotes
      .vote(quoteId)
      .then((response) => {
        setQuotes((prev) =>
          prev.map((q) =>
            q.id === quoteId
              ? { ...q, votes: response.votes, hasVoted: true }
              : q,
          ),
        );
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to vote");
      })
      .finally(() => {
        setVotingId(null);
      });
  };

  const updateParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== "page") {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-heading font-bold mb-8 text-center">
        All Ralph Wiggum Quotes
      </h1>

      <div className="card mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label
              htmlFor="season-filter"
              className="block text-sm font-medium mb-1"
            >
              Season
            </label>
            <select
              id="season-filter"
              value={season ?? ""}
              onChange={(e) => {
                updateParams("season", e.target.value || null);
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-simpsons-yellow"
            >
              <option value="">All Seasons</option>
              {Array.from({ length: 35 }, (_, i) => i + 1).map((s) => (
                <option key={s} value={s}>
                  Season {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="episode-filter"
              className="block text-sm font-medium mb-1"
            >
              Episode
            </label>
            <select
              id="episode-filter"
              value={episode ?? ""}
              onChange={(e) => {
                updateParams("episode", e.target.value || null);
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-simpsons-yellow"
            >
              <option value="">All Episodes</option>
              {Array.from({ length: 25 }, (_, i) => i + 1).map((ep) => (
                <option key={ep} value={ep}>
                  Episode {ep}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort-filter"
              className="block text-sm font-medium mb-1"
            >
              Sort by
            </label>
            <select
              id="sort-filter"
              value={sort ?? ""}
              onChange={(e) => {
                updateParams("sort", e.target.value || null);
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--color-bg-primary)] focus:outline-none focus:ring-2 focus:ring-simpsons-yellow"
            >
              <option value="">Default</option>
              <option value="votes_desc">Most Votes</option>
              <option value="votes_asc">Fewest Votes</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={refetchQuotes} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--color-text-secondary)]">
            No quotes found matching your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {quotes.map((quote) => (
              <QuoteListItem
                key={quote.id}
                quote={quote}
                onVote={() => {
                  handleVote(quote.id);
                }}
                isVoting={votingId === quote.id}
                hasConsent={hasConsent}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => {
                  updateParams("page", String(page - 1));
                }}
                disabled={page <= 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => {
                  updateParams("page", String(page + 1));
                }}
                disabled={page >= pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
