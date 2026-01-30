import { createContext, useContext, type ReactNode } from "react";
import { useCookieConsent, type ConsentStatus } from "../hooks/useCookieConsent";

interface CookieConsentContextValue {
  consentStatus: ConsentStatus;
  hasConsent: boolean;
  showBanner: boolean;
  acceptCookies: () => void;
  rejectCookies: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const consent = useCookieConsent();

  return (
    <CookieConsentContext.Provider value={consent}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsentContext() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsentContext must be used within a CookieConsentProvider"
    );
  }
  return context;
}
