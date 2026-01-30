import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useAdminAuth } from "./useAdminAuth";

describe("useAdminAuth", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with isLoading true", () => {
    vi.spyOn(global, "fetch").mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useAdminAuth());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("sets isAuthenticated to true when checkAuth succeeds", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it("sets isAuthenticated to false when checkAuth fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    } as Response);

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("sets isAuthenticated to false on fetch error", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("login returns true and sets isAuthenticated on success", async () => {
    const fetchMock = vi.spyOn(global, "fetch");
    fetchMock
      .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({}) } as Response)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) } as Response);

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let loginResult: boolean | undefined;
    await act(async () => {
      loginResult = await result.current.login("test-password");
    });

    expect(loginResult).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("login returns false and sets error on failure", async () => {
    const fetchMock = vi.spyOn(global, "fetch");
    fetchMock.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid password" }),
    } as Response);

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let loginResult: boolean | undefined;
    await act(async () => {
      loginResult = await result.current.login("wrong-password");
    });

    expect(loginResult).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe("Invalid password");
  });

  it("login sets generic error on fetch failure", async () => {
    const fetchMock = vi.spyOn(global, "fetch");
    fetchMock
      .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({}) } as Response)
      .mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login("password");
    });

    expect(result.current.error).toBe("Login failed. Please try again.");
  });

  it("logout sets isAuthenticated to false", async () => {
    const fetchMock = vi.spyOn(global, "fetch");
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("logout clears isAuthenticated even if fetch fails", async () => {
    const fetchMock = vi.spyOn(global, "fetch");
    // First call for checkAuth succeeds
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) } as Response);

    const { result } = renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Now set up the logout to fail
    fetchMock.mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      try {
        await result.current.logout();
      } catch {
        // Expected error, ignore
      }
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});
