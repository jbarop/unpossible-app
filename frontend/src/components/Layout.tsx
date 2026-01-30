import { Outlet } from "react-router-dom";
import { useCookieConsentContext } from "../contexts/CookieConsentContext";
import { CookieBanner } from "./CookieBanner";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SkipLink } from "./SkipLink";

export function Layout() {
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsentContext();

  return (
    <div className="min-h-screen flex flex-col">
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      {showBanner && (
        <CookieBanner onAccept={acceptCookies} onReject={rejectCookies} />
      )}
    </div>
  );
}
