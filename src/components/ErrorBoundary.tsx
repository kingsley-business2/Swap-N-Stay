// ========================== src/components/ErrorBoundary.tsx (NEW FILE) ==========================
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to your console for debugging
    console.error("Uncaught error in component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Fallback UI (This renders instead of a blank page!)
      return (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fee2e2', border: '1px solid #fca5a5' }} className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-red-700">🛑 Application Failed to Load</h1>
          <p className="mt-2 text-lg text-gray-700">A critical, unhandled error occurred during startup.</p>
          <p className="mt-4 text-sm text-gray-500">
            *Please open your **browser console** (F12 on desktop) for the specific error details.*
          </p>
          <p className="mt-1 text-sm text-gray-500">
            If this message appears, the hardcoded key fix did not prevent the final runtime crash.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
