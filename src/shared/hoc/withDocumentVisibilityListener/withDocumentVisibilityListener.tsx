import React from 'react';

type Thidden = 'hidden' | 'msHidden' | 'webkitHidden';
type TvisibilityChange =
  | 'visibilitychange'
  | 'msvisibilitychange'
  | 'webkitvisibilitychange';

interface Iprops {}

/**
 * It adds event listener off visibility change event on document.
 * This HOC function help to detect whether the tab is active or not.
 * @param {@type React.Component<P>} Component
 */
const withDocumentVisibilityListener = <P extends Iprops>(
  Component: React.ComponentType<P>,
): React.ComponentType<Omit<P, keyof Iprops>> => {
  class WithDocumentVisibilityListener extends React.Component<
    P,
    { tabIsActiveNow: boolean }
  > {
    hidden: Thidden | undefined;
    visibilityChange: TvisibilityChange | undefined;
    constructor(props: Readonly<P>) {
      super(props);

      this.state = {
        tabIsActiveNow: false,
      };

      if (typeof document.hidden !== 'undefined') {
        // Opera 12.10 and Firefox 18 and later support
        this.hidden = 'hidden';
        this.visibilityChange = 'visibilitychange';
      } else if (typeof (document as any).msHidden !== 'undefined') {
        this.hidden = 'msHidden';
        this.visibilityChange = 'msvisibilitychange';
      } else if (typeof (document as any).webkitHidden !== 'undefined') {
        this.hidden = 'webkitHidden';
        this.visibilityChange = 'webkitvisibilitychange';
      }

      if (
        typeof document.addEventListener !== 'undefined' ||
        this.hidden !== undefined
      ) {
        document.addEventListener(
          this.visibilityChange as TvisibilityChange,
          this.handleVisibilityChange.bind(this),
          false,
        );
      }
    }

    componentWillUnmount() {
      window.removeEventListener(
        this.visibilityChange as TvisibilityChange,
        this.handleVisibilityChange.bind(this),
        false,
      );
    }

    handleVisibilityChange(_event: Event) {
      if (!document[this.hidden as 'hidden']) {
        // tab is visible
        this.setState({
          tabIsActiveNow: true,
        });
      } else {
        this.setState({
          tabIsActiveNow: false,
        });
      }
    }

    render() {
      return (
        <Component {...this.props} tabIsActiveNow={this.state.tabIsActiveNow} />
      );
    }
  }
  return WithDocumentVisibilityListener;
};

export default withDocumentVisibilityListener;
