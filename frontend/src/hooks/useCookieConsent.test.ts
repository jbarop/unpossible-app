import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCookieConsent } from "./useCookieConsent";

describe("useCookieConsent", () => {
  const STORAGE_KEY = "cookie_consent";

  beforeEach(() => {
    localStorage.clear();
  });

  it("returns pending status by default", () => {
    const { result } = renderHook(() => useCookieConsent());

    expect(result.current.consentStatus).toBe("pending");
    expect(result.current.showBanner).toBe(true);
    expect(result.current.hasConsent).toBe(false);
  });

  it("returns accepted status when stored", () => {
    localStorage.setItem(STORAGE_KEY, "accepted");

    const { result } = renderHook(() => useCookieConsent());

    expect(result.current.consentStatus).toBe("accepted");
    expect(result.current.showBanner).toBe(false);
    expect(result.current.hasConsent).toBe(true);
  });

  it("returns rejected status when stored", () => {
    localStorage.setItem(STORAGE_KEY, "rejected");

    const { result } = renderHook(() => useCookieConsent());

    expect(result.current.consentStatus).toBe("rejected");
    expect(result.current.showBanner).toBe(false);
    expect(result.current.hasConsent).toBe(false);
  });

  it("acceptCookies sets status to accepted", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      result.current.acceptCookies();
    });

    expect(result.current.consentStatus).toBe("accepted");
    expect(result.current.hasConsent).toBe(true);
    expect(result.current.showBanner).toBe(false);
  });

  it("rejectCookies sets status to rejected", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      result.current.rejectCookies();
    });

    expect(result.current.consentStatus).toBe("rejected");
    expect(result.current.hasConsent).toBe(false);
    expect(result.current.showBanner).toBe(false);
  });

  it("persists accepted consent to localStorage", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      result.current.acceptCookies();
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe("accepted");
  });

  it("persists rejected consent to localStorage", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      result.current.rejectCookies();
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe("rejected");
  });

  it("does not persist pending status to localStorage", () => {
    renderHook(() => useCookieConsent());

    expect(localStorage.getItem(STORAGE_KEY)).toBe(null);
  });
});
