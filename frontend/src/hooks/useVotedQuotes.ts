import { useCallback, useState } from "react";

export function useVotedQuotes() {
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const markAsVoted = useCallback((quoteId: string) => {
    setVotedIds((prev) => new Set(prev).add(quoteId));
  }, []);

  const hasVoted = useCallback(
    (quoteId: string) => {
      return votedIds.has(quoteId);
    },
    [votedIds],
  );

  const initializeFromServer = useCallback((ids: string[]) => {
    setVotedIds(new Set(ids));
  }, []);

  return { votedIds, markAsVoted, hasVoted, initializeFromServer };
}
