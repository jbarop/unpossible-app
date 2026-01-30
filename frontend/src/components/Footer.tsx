import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            &quot;Me fail English? That&apos;s unpossible!&quot; - Ralph Wiggum
          </p>
          <nav className="flex gap-4 text-sm">
            <Link
              to="/privacy"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
