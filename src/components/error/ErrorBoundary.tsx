import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree
 * Logs errors and displays a fallback UI
 * Supports dark mode
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // Here you could send error to an error reporting service
    // e.g., Sentry, LogRocket, etc.
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white dark:bg-gray-900">
          <div className="max-w-md">
            {/* Error icon */}
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Bir hata oluştu
            </h1>

            {/* Error message */}
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Üzgünüz, beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin veya
              daha sonra tekrar deneyin.
            </p>

            {/* Error details (development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Hata detayları
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-red-600 dark:text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg
                           hover:bg-primary-700 focus:outline-none focus:ring-2 
                           focus:ring-primary-500 focus:ring-offset-2
                           dark:focus:ring-offset-gray-900
                           transition-colors"
              >
                Tekrar Dene
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 
                           text-gray-800 dark:text-gray-200 font-medium rounded-lg
                           hover:bg-gray-300 dark:hover:bg-gray-600 
                           focus:outline-none focus:ring-2 
                           focus:ring-gray-400 focus:ring-offset-2
                           dark:focus:ring-offset-gray-900
                           transition-colors"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
