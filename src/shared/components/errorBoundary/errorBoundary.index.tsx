import React, { ReactNode, PureComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Result } from 'antd';

class ErrorBoundary extends PureComponent<
  { fallbackUi?: ReactNode } & RouteComponentProps,
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidUpdate(prevProps: any) {
    if (this.state.hasError) {
      if (
        prevProps.location.pathname !== this.props.location.pathname ||
        prevProps.location.search !== this.props.location.search
      ) {
        // on url change hiding error page.
        this.setState({ hasError: false });
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      const { fallbackUi } = this.props;
      return fallbackUi ? (
        fallbackUi
      ) : (
        <Result
          status='warning'
          title='There are some problems with your operation.'
        />
      );
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
