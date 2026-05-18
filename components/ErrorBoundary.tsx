"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Log to console in dev; swap for a real error service in prod
    console.error("[StatQuest] Unhandled error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ background: "var(--bg-base)" }}
        >
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>⚔</div>
          <h1
            className="font-display font-bold mb-3"
            style={{ fontSize: "clamp(22px, 5vw, 32px)", color: "var(--accent-indigo)" }}
          >
            Something broke in the dungeon.
          </h1>
          <p
            className="font-sans mb-8 max-w-sm"
            style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}
          >
            Your progress is saved. Return to the world map and try again.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = "/world";
            }}
            className="btn-primary"
            style={{ padding: "14px 32px", borderRadius: "12px", fontSize: "15px" }}
          >
            Return to World Map
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
