import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class AppErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-sans">
                    <div className="bg-white p-10 rounded-[3rem] border border-red-100 shadow-2xl max-w-md w-full text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={40} />
                        </div>
                        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h1>
                        <p className="text-neutral-500 text-sm mb-8">
                            We encountered an unexpected terminal error. Please try refreshing the page or contact support if the problem persists.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all shadow-lg active:scale-95"
                        >
                            <RotateCcw size={18} />
                            Reload Experience
                        </button>
                        <p className="mt-6 text-[10px] font-mono text-neutral-300 lowercase italic">
                            err_ref: {this.state.error?.message.slice(0, 20)}...
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;
