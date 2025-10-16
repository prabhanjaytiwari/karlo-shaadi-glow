import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-2xl w-full bg-card border-2 border-border/50 rounded-3xl p-8 sm:p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            
            <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Oops! Something Went Wrong
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8">
              We encountered an unexpected error. Don't worry, our team has been notified and we're working on fixing it.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-8 text-left bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-sm mb-2 text-destructive">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs overflow-auto whitespace-pre-wrap text-muted-foreground">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                onClick={this.handleGoHome}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              If the problem persists, please contact our{" "}
              <a href="/support" className="text-primary hover:underline">
                support team
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}