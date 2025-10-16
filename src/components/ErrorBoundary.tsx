// ========================== src/components/ErrorBoundary.tsx (UPDATED) ==========================
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  // Add error and errorInfo to state for display
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { 
      hasError: true, 
      error: error, // Capture the error object
      errorInfo: null // errorInfo is captured in componentDidCatch
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to your console for debugging
    console.error("Uncaught error in component:", error, errorInfo);
    // Update state with errorInfo for display
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      // Temporary Fallback UI showing the actual error details
      return (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#FEEEEE', border: '1px solid #CC0000' }} className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-red-700 mb-4">🛑 Application Failed to Load</h1>
          <h2 className="text-xl font-semibold text-red-600 mb-2">CRASH DETAILS (TEMPORARY DIAGNOSTIC)</h2>
          
          <div style={{ 
            textAlign: 'left', 
            maxWidth: '90%', 
            width: '600px', 
            padding: '15px', 
            backgroundColor: '#FFDEDE', 
            border: '1px solid #CC0000', 
            borderRadius: '5px' 
          }}>
            {/* Display the Error Message */}
            <p className="font-bold text-red-800">Error Message:</p>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px', color: '#333' }}>
              {this.state.error ? this.state.error.message : 'Unknown Error'}
            </pre>
            
            {/* Display the Stack Trace */}
            <p className="font-bold text-red-800 mt-3">Stack Trace (Source of Crash):</p>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>
              {this.state.error ? this.state.error.stack : 'No Stack Trace Available'}
            </pre>
          </div>
          
          <p className="mt-6 text-sm text-gray-700">
            **ACTION REQUIRED:** Please copy the entire **Stack Trace** above and send it to me.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (Remember to revert this file to its original state after the fix is complete.)
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
