interface VoteButtonProps {
  votes: number;
  hasVoted: boolean;
  onVote: () => void;
  disabled?: boolean;
}

export function VoteButton({
  votes,
  hasVoted,
  onVote,
  disabled,
}: VoteButtonProps) {
  return (
    <button
      onClick={onVote}
      disabled={disabled ?? hasVoted}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        hasVoted
          ? "bg-simpsons-pink text-gray-900 cursor-not-allowed focus:ring-simpsons-pink"
          : "bg-simpsons-sky hover:bg-simpsons-sky-dark text-gray-900 focus:ring-simpsons-sky"
      }`}
      aria-label={hasVoted ? `You voted - ${String(votes)} votes` : `Upvote - ${String(votes)} votes`}
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
