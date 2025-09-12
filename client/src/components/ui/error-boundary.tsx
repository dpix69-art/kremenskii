import { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Section } from '@/components/primitives';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Section paddingY="xl">
          <Container>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Something went wrong
              </h1>
              <p className="text-muted-foreground mb-6">
                An error occurred while rendering this page. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Refresh Page
              </button>
            </div>
          </Container>
        </Section>
      );
    }

    return this.props.children;
  }
}