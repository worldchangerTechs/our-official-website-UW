import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className="error-boundary" role="alert" style={{ padding: '1rem' }}>
            <h2>Something went wrong.</h2>
            <pre>{this.state.error?.toString()}</pre>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </div>
        );
      }
      return <div className="error-boundary" role="alert">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}
