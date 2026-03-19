import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { captureReactError } from "@/lib/errorMonitor";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for reference
    const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    
    // Capture error for monitoring
    captureReactError(error, errorInfo, 'ErrorBoundary');
    
    // Call optional error callback
    this.props.onError?.(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-2xl w-full bg-card border-2 border-border/50 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            
            <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Oops! Something Went Wrong
            </h1>
            
            <p className="text-muted-foreground text-lg mb-4">
              We encountered an unexpected error. Our team has been notified and we're working on fixing it.
            </p>

            {this.state.errorId && (
              <p className="text-sm text-muted-foreground mb-6 font-mono bg-muted/50 rounded-lg py-2 px-4 inline-block">
                Error Reference: {this.state.errorId}
              </p>
            )}

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-8 text-left bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-sm mb-2 text-destructive">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs overflow-auto whitespace-pre-wrap text-muted-foreground mt-2 p-2 bg-background/50 rounded">
                  <strong>Error:</strong> {this.state.error.toString()}
                  {'\n\n'}
                  <strong>Stack:</strong>
                  {'\n'}{this.state.error.stack}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {'\n'}{this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Button
                size="lg"
                onClick={this.handleReset}
                className="gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={this.handleReload}
                className="gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Page
              </Button>
              
              <Button
                size="lg"
                variant="ghost"
                onClick={this.handleGoHome}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              If the problem persists, please contact our{" "}
              <a href="/support" className="text-primary hover:underline inline-flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                support team
              </a>
              {this.state.errorId && (
                <> with reference code <strong>{this.state.errorId}</strong></>
              )}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}