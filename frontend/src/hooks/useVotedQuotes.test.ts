import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVotedQuotes } from "./useVotedQuotes";

describe("useVotedQuotes", () => {
  it("starts with empty voted IDs set", () => {
    const { result } = renderHook(() => useVotedQuotes());

    expect(result.current.votedIds.size).toBe(0);
  });

  it("markAsVoted adds quote ID to set", () => {
    const { result } = renderHook(() => useVotedQuotes());

    act(() => {
      result.current.markAsVoted("quote-1");
    });

    expect(result.current.votedIds.has("quote-1")).toBe(true);
    expect(result.current.hasVoted("quote-1")).toBe(true);
  });

  it("hasVoted returns false for unvoted quote", () => {
    const { result } = renderHook(() => useVotedQuotes());

    expect(result.current.hasVoted("quote-1")).toBe(false);
  });

  it("hasVoted returns true for voted quote", () => {
    const { result } = renderHook(() => useVotedQuotes());

    act(() => {
      result.current.markAsVoted("quote-1");
    });

    expect(result.current.hasVoted("quote-1")).toBe(true);
  });

  it("can mark multiple quotes as voted", () => {
    const { result } = renderHook(() => useVotedQuotes());

    act(() => {
      result.current.markAsVoted("quote-1");
      result.current.markAsVoted("quote-2");
      result.current.markAsVoted("quote-3");
    });

    expect(result.current.votedIds.size).toBe(3);
    expect(result.current.hasVoted("quote-1")).toBe(true);
    expect(result.current.hasVoted("quote-2")).toBe(true);
    expect(result.current.hasVoted("quote-3")).toBe(true);
  });

  it("initializeFromServer sets voted IDs from array", () => {
    const { result } = renderHook(() => useVotedQuotes());

    act(() => {
      result.current.initializeFromServer(["quote-1", "quote-2"]);
    });

    expect(result.current.votedIds.size).toBe(2);
    expect(result.current.hasVoted("quote-1")).toBe(true);
    expect(result.current.hasVoted("quote-2")).toBe(true);
  });

  it("initializeFromServer replaces existing voted IDs", () => {
    const { result } = renderHook(() => useVotedQuotes());

    act(() => {
      result.current.markAsVoted("old-quote");
    });

    expect(result.current.hasVoted("old-quote")).toBe(true);

    act(() => {
      result.current.initializeFromServer(["new-quote"]);
    });

    expect(result.current.hasVoted("old-quote")).toBe(false);
    expect(result.current.hasVoted("new-quote")).toBe(true);
  });

  it("marking same quote twice does not create duplicates", () => {
    const { result } = renderHook(() => useVotedQuotes());

    act(() => {
      result.current.markAsVoted("quote-1");
      result.current.markAsVoted("quote-1");
    });

    expect(result.current.votedIds.size).toBe(1);
  });
});
