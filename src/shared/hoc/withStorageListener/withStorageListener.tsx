import React from 'react';
import { restoreData } from '../../redux/auth/auth.thunk';
import Store from '../../redux/store/store.index';
import { ReimburseGlobalLoader } from '../../components';
import { IappProps } from '../../../pages/app/app.model';

let ifStorageListenerDidNotTrigerTimer: NodeJS.Timeout;

/**
 * It adds event listener off storage change event on window.
 * This HOC function help to restore or clear session storage in multiple active tabs.
 * @param {@type React.Component<P>} Component
 */
const withStorageListener = <P extends IappProps>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> => {
  class WithStorageListener extends React.Component<P, { loading: boolean }> {
    constructor(props: Readonly<P>) {
      super(props);

      this.state = {
        loading: true,
      };

      window.addEventListener('storage', this.handleStorageListener.bind(this));
      localStorage.setItem(
        'REQUESTING_SHARED_CREDENTIALS',
        JSON.stringify(sessionStorage),
      );
      localStorage.removeItem('REQUESTING_SHARED_CREDENTIALS');
    }

    componentDidMount() {
      ifStorageListenerDidNotTrigerTimer = setTimeout(() => {
        this.setState({ loading: false });
      }, 200);
    }

    componentWillUnmount() {
      window.removeEventListener(
        'storage',
        this.handleStorageListener.bind(this),
      );
    }

    handleStorageListener(event: StorageEvent) {
      if (ifStorageListenerDidNotTrigerTimer)
        clearTimeout(ifStorageListenerDidNotTrigerTimer);
      const credentials = sessionStorage.getItem('TOKEN') || '';

      if (event.key === 'REQUESTING_SHARED_CREDENTIALS') {
        if (credentials) {
          // sharing data for restoration.
          const copySesStore = { ...sessionStorage };
          delete copySesStore.USER_LOGGED_OUT;
          localStorage.setItem(
            'CREDENTIALS_SHARING',
            JSON.stringify(sessionStorage),
          );
          localStorage.removeItem('CREDENTIALS_SHARING');
        } else {
          this.setState({ loading: false });
        }
      } else if (event.key === 'CREDENTIALS_SHARING') {
        if (!credentials) {
          // restoring data
          const parsedNewValue = JSON.parse(event.newValue || '');
          Object.keys(parsedNewValue).forEach((o: string) => {
            sessionStorage.setItem(o, parsedNewValue[o] || '');
          });
          Store.dispatch(restoreData()); // updating redux
        } else {
          this.setState({ loading: false });
        }
      } else if (event.key === 'CREDENTIALS_FLUSH' && credentials) {
        // clearing data from all active tabs.
        const TENANT: string = localStorage.getItem('TENANT') || '';
        localStorage.clear();
        const AT: string = sessionStorage.getItem('AT') || '';
        sessionStorage.clear();
        sessionStorage.setItem('AT', AT); //restoring Auth Type for redirection
        localStorage.setItem('TENANT', TENANT); //restoring tenant for redirection
        if (
          document.hidden ||
          (document as any).msHidden ||
          (document as any).webkitHidden
        ) {
          sessionStorage.setItem('USER_LOGGED_OUT', 'true');
        }
      }
    }

    render() {
      return this.state.loading ? (
        <ReimburseGlobalLoader />
      ) : (
        <Component {...this.props} />
      );
    }
  }
  return WithStorageListener;
};

export default withStorageListener;
