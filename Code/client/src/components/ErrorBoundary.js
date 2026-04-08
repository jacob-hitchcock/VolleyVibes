import React from 'react';

/**
 * ErrorBoundary catches unhandled JavaScript errors anywhere in its child
 * component tree and renders a fallback UI instead of crashing the entire app.
 *
 * React error boundaries must be class components — there is no hook equivalent.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <MyComponent />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, message: null };
    }

    /**
     * Called when a descendant throws. Updates state so the next render shows
     * the fallback UI.
     * @param {Error} error
     */
    static getDerivedStateFromError(error) {
        return { hasError: true, message: error.message };
    }

    /**
     * Called after an error has been caught. Good place to log to an error
     * reporting service (e.g. Sentry) in the future.
     * @param {Error} error
     * @param {React.ErrorInfo} info
     */
    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught an error:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>Something went wrong.</h2>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>
                        Refresh the page or contact support if the problem persists.
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <pre style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#999', textAlign: 'left', overflowX: 'auto' }}>
                            {this.state.message}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
