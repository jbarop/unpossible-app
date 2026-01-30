import type { Quote, QuoteCreate, QuoteUpdate } from "@unpossible/shared";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { QuoteModal } from "../components/QuoteModal";
import type { QuoteFormData } from "../components/QuoteForm";
import { SEO } from "../components/SEO";
import { useAdminAuth } from "../hooks/useAdminAuth";

interface PaginatedQuotes {
  data: Quote[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function AdminQuotes() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchQuotes = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/quotes?page=${String(page)}&limit=20`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          void navigate("/admin");
          return;
        }
        throw new Error("Failed to fetch quotes");
      }

      const result = (await response.json()) as PaginatedQuotes;
      setQuotes(result.data);
      setPagination({
        page: result.pagination.page,
        totalPages: result.pagination.totalPages,
        total: result.pagination.total,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void fetchQuotes();
  }, [fetchQuotes]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleCreate = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data satisfies QuoteCreate),
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        throw new Error(result.message ?? "Failed to create quote");
      }

      setIsCreateModalOpen(false);
      showSuccess("Quote created successfully");
      void fetchQuotes(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: QuoteFormData) => {
    if (!editingQuote) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/quotes/${editingQuote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data satisfies QuoteUpdate),
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        throw new Error(result.message ?? "Failed to update quote");
      }

      setEditingQuote(null);
      showSuccess("Quote updated successfully");
      void fetchQuotes(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingQuote) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/quotes/${deletingQuote.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quote");
      }

      setDeletingQuote(null);
      showSuccess("Quote deleted successfully");
      void fetchQuotes(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        void navigate("/admin");
      })
      .catch(() => {
        // Logout failed, still navigate to admin login
        void navigate("/admin");
      });
  };

  return (
    <div className="py-8">
      <SEO title="Quote Management" noIndex />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold">Quote Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
            className="btn-primary"
          >
            Add Quote
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {successMessage && (
        <div
          className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg p-4"
          role="status"
        >
          {successMessage}
        </div>
      )}

      {error && (
        <div
          className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-4"
          role="alert"
        >
          {error}
          <button
            onClick={() => {
              setError(null);
            }}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No quotes found. Add your first quote!
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Showing {quotes.length} of {pagination.total} quotes
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium">Quote</th>
                  <th className="text-left py-3 px-4 font-medium w-24">Season</th>
                  <th className="text-left py-3 px-4 font-medium w-24">Episode</th>
                  <th className="text-left py-3 px-4 font-medium w-24">Votes</th>
                  <th className="text-right py-3 px-4 font-medium w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <p className="line-clamp-2">{quote.text}</p>
                    </td>
                    <td className="py-3 px-4">{quote.season}</td>
                    <td className="py-3 px-4">{quote.episode}</td>
                    <td className="py-3 px-4">{quote.votes}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingQuote(quote);
                        }}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        aria-label={`Edit quote: ${quote.text.substring(0, 30)}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeletingQuote(quote);
                        }}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        aria-label={`Delete quote: ${quote.text.substring(0, 30)}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => {
                  void fetchQuotes(pagination.page - 1);
                }}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => {
                  void fetchQuotes(pagination.page + 1);
                }}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <QuoteModal
        isOpen={isCreateModalOpen}
        title="Add New Quote"
        onSubmit={(data) => {
          void handleCreate(data);
        }}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        isLoading={isSubmitting}
      />

      <QuoteModal
        isOpen={!!editingQuote}
        title="Edit Quote"
        initialData={editingQuote ? {
          text: editingQuote.text,
          season: editingQuote.season,
          episode: editingQuote.episode,
        } : undefined}
        onSubmit={(data) => {
          void handleUpdate(data);
        }}
        onClose={() => {
          setEditingQuote(null);
        }}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={!!deletingQuote}
        title="Delete Quote"
        message={`Are you sure you want to delete this quote? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={() => {
          void handleDelete();
        }}
        onCancel={() => {
          setDeletingQuote(null);
        }}
        isLoading={isSubmitting}
        variant="danger"
      />
    </div>
  );
}
