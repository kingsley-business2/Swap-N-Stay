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
    // You can also log the error to an error reporting service
    console.error("Uncaught error in component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Fallback UI (This is what will render instead of the blank page!)
      return (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fee2e2', border: '1px solid #fca5a5' }}>
          <h1>🛑 Application Failed to Load</h1>
          <p>A critical, unhandled error occurred during startup.</p>
          <p>Please check the **browser console** (F12) for details.</p>
          <p>If the error mentions **Supabase URL**, the environment variables are still the issue.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
