import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.less';
// import App from './pages/app/app.index';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import Store, { persistStor } from './shared/redux/store/store.index';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nProvider } from '@lingui/react';
import { messages as enMessages } from './locales/en/messages';
import { messages as msMessages } from './locales/ms/messages';
import { messages as cnMessages } from './locales/zh-cn/messages';
import { en, ms, zh } from 'make-plural/plurals';

import { i18n } from '@lingui/core';

import { pdfjs } from 'react-pdf';

// import { APP_REDUCER_ACTIONS } from './pages/app/app.actions';

import { ReimburseGlobalLoader } from './shared/components/';
const App = lazy(() => import('./pages/app/app.index'));

(window as any).reimData = Store;

//react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

i18n.loadLocaleData({
  en: { plurals: en },
  ms: { plurals: ms },
  'zh-cn': { plurals: zh },
});
const local = Store.getState()?.dashboard.ln;
i18n.load({
  en: enMessages,
  ms: msMessages,
  'zh-cn': cnMessages,
});
i18n.activate(local);
ReactDOM.render(
  <>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistStor}>
        <I18nProvider i18n={i18n}>
          <Router>
            <Suspense fallback={<ReimburseGlobalLoader />}>
              <App />
            </Suspense>
          </Router>
        </I18nProvider>
      </PersistGate>
    </Provider>
  </>,
  document.getElementById('root'),
);

const onUpdateFn = (reg: any) => {
  // Store.dispatch({
  //   type: APP_REDUCER_ACTIONS.NEW_VERSION_AVAILABLE,
  //   payload: {
  //     waitingWorker: reg,
  //     newVersionAvailable: true,
  //   },
  // });

  // Directly updating new version changes
  try {
    const _waiting = reg.waiting;
    if (_waiting) {
      _waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  } catch (error) {
    console.error('DEV ERROR : [NewVersionUpdate]', error);
  }
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: onUpdateFn,
  // onSuccess: () => Store.dispatch({ type: 'SW_INIT' }),
});
