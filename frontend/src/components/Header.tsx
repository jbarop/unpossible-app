import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-simpsons-yellow text-gray-900"
        : "hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <header className="border-b border-gray-200 dark:border-gray-700">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-heading font-bold text-simpsons-yellow hover:text-simpsons-yellow-dark transition-colors"
          >
            Umpossible
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/quotes" className={navLinkClass}>
              All Quotes
            </NavLink>
            <ThemeToggle />
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2">
            <NavLink
              to="/"
              className={navLinkClass}
              end
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              Home
            </NavLink>
            <NavLink
              to="/quotes"
              className={navLinkClass}
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              All Quotes
            </NavLink>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
