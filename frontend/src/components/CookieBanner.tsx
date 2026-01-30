import { Link } from "react-router-dom";

interface CookieBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

export function CookieBanner({ onAccept, onReject }: CookieBannerProps) {
  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg-secondary)] border-t border-gray-300 dark:border-gray-600 shadow-lg p-4 md:p-6"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h2
              id="cookie-banner-title"
              className="font-semibold text-lg mb-1"
            >
              Cookie-Hinweis
            </h2>
            <p
              id="cookie-banner-description"
              className="text-sm text-[var(--color-text-secondary)]"
            >
              Diese Website verwendet ein Session-Cookie, um die
              Abstimmungsfunktion zu ermöglichen. Das Cookie speichert eine
              anonyme ID und wird nicht für Tracking verwendet.{" "}
              <Link
                to="/privacy"
                className="underline hover:text-simpsons-yellow"
              >
                Mehr erfahren
              </Link>
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={onReject}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Ablehnen
            </button>
            <button
              onClick={onAccept}
              className="btn-primary text-sm"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
