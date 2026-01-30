interface VoteButtonProps {
  votes: number;
  hasVoted: boolean;
  onVote: () => void;
  disabled?: boolean;
  hasConsent?: boolean;
}

export function VoteButton({
  votes,
  hasVoted,
  onVote,
  disabled,
  hasConsent = true,
}: VoteButtonProps) {
  const isDisabled = disabled ?? (hasVoted || !hasConsent);
  const needsConsent = !hasConsent && !hasVoted;

  const getAriaLabel = () => {
    if (needsConsent) return `Voting disabled - Cookie consent required - ${String(votes)} votes`;
    if (hasVoted) return `You voted - ${String(votes)} votes`;
    return `Upvote - ${String(votes)} votes`;
  };

  return (
    <button
      onClick={onVote}
      disabled={isDisabled}
      title={needsConsent ? "Cookie-Zustimmung erforderlich" : undefined}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        hasVoted
          ? "bg-simpsons-pink text-gray-900 cursor-not-allowed focus:ring-simpsons-pink"
          : needsConsent
            ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed focus:ring-gray-400"
            : "bg-simpsons-sky hover:bg-simpsons-sky-dark text-gray-900 focus:ring-simpsons-sky"
      }`}
      aria-label={getAriaLabel()}
    >
      <svg
        className={`w-5 h-5 ${hasVoted ? "fill-current" : ""}`}
        fill={hasVoted ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{votes}</span>
    </button>
  );
}
