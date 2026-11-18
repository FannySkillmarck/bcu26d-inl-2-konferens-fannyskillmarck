import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  private handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="mx-auto my-12 max-w-lg rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 text-[var(--text-primary)] shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-brass)]">
            Stjärnfall 2027
          </p>
          <h2 className="typo-display mt-2 text-xl font-semibold">
            Something went wrong
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
            A connection or permission error interrupted this view. You can
            retry or refresh the page.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="btn-primary mt-4 px-4 py-2 text-xs"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
