import { describe, it, expect } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { SEO } from "./SEO";

const renderWithHelmet = (ui: React.ReactElement) => {
  return render(<HelmetProvider>{ui}</HelmetProvider>);
};

describe("SEO", () => {
  it("renders default title when no title provided", async () => {
    renderWithHelmet(<SEO />);

    await waitFor(() => {
      expect(document.title).toBe("Umpossible - Ralph Wiggum Quotes");
    });
  });

  it("renders custom title with site name", async () => {
    renderWithHelmet(<SEO title="All Quotes" />);

    await waitFor(() => {
      expect(document.title).toBe("All Quotes | Umpossible");
    });
  });

  it("renders default description", async () => {
    renderWithHelmet(<SEO />);

    await waitFor(() => {
      const meta = document.querySelector('meta[name="description"]');
      expect(meta).toHaveAttribute(
        "content",
        expect.stringContaining("Ralph Wiggum quotes")
      );
    });
  });

  it("renders custom description", async () => {
    renderWithHelmet(<SEO description="Custom description" />);

    await waitFor(() => {
      const meta = document.querySelector('meta[name="description"]');
      expect(meta).toHaveAttribute("content", "Custom description");
    });
  });

  it("renders Open Graph meta tags", async () => {
    renderWithHelmet(<SEO title="Test" description="Test desc" />);

    await waitFor(() => {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle).toHaveAttribute("content", "Test | Umpossible");

      const ogDesc = document.querySelector('meta[property="og:description"]');
      expect(ogDesc).toHaveAttribute("content", "Test desc");

      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType).toHaveAttribute("content", "website");

      const ogSiteName = document.querySelector(
        'meta[property="og:site_name"]'
      );
      expect(ogSiteName).toHaveAttribute("content", "Umpossible");
    });
  });

  it("renders Twitter Card meta tags", async () => {
    renderWithHelmet(<SEO title="Test" description="Test desc" />);

    await waitFor(() => {
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      expect(twitterCard).toHaveAttribute("content", "summary");

      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      expect(twitterTitle).toHaveAttribute("content", "Test | Umpossible");
    });
  });

  it("renders canonical URL when provided", async () => {
    renderWithHelmet(<SEO canonicalPath="/quotes" />);

    await waitFor(() => {
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).toHaveAttribute("href", "/quotes");
    });
  });

  it("does not render canonical URL when not provided", async () => {
    renderWithHelmet(<SEO />);

    await waitFor(() => {
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeInTheDocument();
    });
  });

  it("renders noindex meta tag when noIndex is true", async () => {
    renderWithHelmet(<SEO noIndex />);

    await waitFor(() => {
      const robots = document.querySelector('meta[name="robots"]');
      expect(robots).toHaveAttribute("content", "noindex, nofollow");
    });
  });

  it("does not render noindex meta tag by default", async () => {
    renderWithHelmet(<SEO />);

    await waitFor(() => {
      const robots = document.querySelector('meta[name="robots"]');
      expect(robots).not.toBeInTheDocument();
    });
  });

  it("renders article type when specified", async () => {
    renderWithHelmet(<SEO type="article" />);

    await waitFor(() => {
      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType).toHaveAttribute("content", "article");
    });
  });
});
