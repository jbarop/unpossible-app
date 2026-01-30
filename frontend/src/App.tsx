import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminRoute } from "./components/AdminRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { CookieConsentProvider } from "./contexts/CookieConsentContext";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Privacy } from "./pages/Privacy";
import { QuoteDetail } from "./pages/QuoteDetail";
import { Quotes } from "./pages/Quotes";

// Lazy load admin pages for smaller initial bundle
const AdminLogin = lazy(() =>
  import("./pages/AdminLogin").then((m) => ({ default: m.AdminLogin })),
);
const AdminQuotes = lazy(() =>
  import("./pages/AdminQuotes").then((m) => ({ default: m.AdminQuotes })),
);

function AdminLoadingFallback() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-simpsons-yellow" />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <CookieConsentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="quote/:id" element={<QuoteDetail />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="privacy" element={<Privacy />} />
              <Route
                path="admin"
                element={
                  <Suspense fallback={<AdminLoadingFallback />}>
                    <AdminLogin />
                  </Suspense>
                }
              />
              <Route
                path="admin/quotes"
                element={
                  <AdminRoute>
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminQuotes />
                    </Suspense>
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CookieConsentProvider>
    </ErrorBoundary>
  );
}
