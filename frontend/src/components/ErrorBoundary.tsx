import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  onReset: () => void;
}

function ErrorFallback({ onReset }: ErrorFallbackProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4"
      role="alert"
    >
      <h1 className="text-6xl font-heading font-bold text-simpsons-yellow mb-4">
        Oops!
      </h1>
      <p className="text-xl mb-2">
        &quot;My cat&apos;s breath smells like cat food.&quot;
      </p>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Something went wrong. Please try again.
      </p>
      <div className="flex gap-4">
        <button onClick={onReset} className="btn-primary">
          Try Again
        </button>
        <a href="/" className="btn-secondary">
          Go Home
        </a>
      </div>
    </div>
  );
}
