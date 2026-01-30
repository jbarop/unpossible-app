import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminRoute } from "./components/AdminRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { CookieConsentProvider } from "./contexts/CookieConsentContext";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminQuotes } from "./pages/AdminQuotes";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Privacy } from "./pages/Privacy";
import { QuoteDetail } from "./pages/QuoteDetail";
import { Quotes } from "./pages/Quotes";

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
              <Route path="admin" element={<AdminLogin />} />
              <Route
                path="admin/quotes"
                element={
                  <AdminRoute>
                    <AdminQuotes />
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
