"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="mx-auto max-w-lg min-h-dvh bg-background flex flex-col items-center justify-center px-8 text-center">
            <p className="text-3xl mb-4">🫶</p>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-[240px]">
              F.O.R.M. ran into an issue. Your data is safe locally.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium"
            >
              Reload
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
