import { useCallback, useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "cookie_consent";

export type ConsentStatus = "pending" | "accepted" | "rejected";

export function useCookieConsent() {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === "accepted") return "accepted";
    if (stored === "rejected") return "rejected";
    return "pending";
  });

  useEffect(() => {
    if (consentStatus !== "pending") {
      localStorage.setItem(COOKIE_CONSENT_KEY, consentStatus);
    }
  }, [consentStatus]);

  const acceptCookies = useCallback(() => {
    setConsentStatus("accepted");
  }, []);

  const rejectCookies = useCallback(() => {
    setConsentStatus("rejected");
  }, []);

  const hasConsent = consentStatus === "accepted";
  const showBanner = consentStatus === "pending";

  return {
    consentStatus,
    hasConsent,
    showBanner,
    acceptCookies,
    rejectCookies,
  };
}
