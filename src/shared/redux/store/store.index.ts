import { createStore, applyMiddleware } from 'redux';
import Reducer from '../rootReducer';
import Thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const middlewares = [Thunk];
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'app', 'AllowanceNewReducer'],
};
export const createStoreWithMiddleware = applyMiddleware(...middlewares)(
  createStore,
);
// const Store = createStore(Reducer, applyMiddleware(Thunk));
// const Store = createStoreWithMiddleware(Reducer);

// const composeEnhancers =
//   (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
});
const PersistReducer = persistReducer(persistConfig, Reducer);

let Store = createStore(
  PersistReducer,
  process.env.REACT_APP_ENVIRONMENT === 'SAP_PRODUCTION' ||
    process.env.REACT_APP_ENVIRONMENT === 'SAP_STAGING'
    ? applyMiddleware(...middlewares)
    : composeEnhancers(applyMiddleware(...middlewares)),
);

// if (process.env.REACT_APP_ENVIRONMENT !== 'DEVELOPMENT') {
//   Store = createStoreWithMiddleware(Reducer);
// }

const persistStor = persistStore(Store);
export { persistStor };
export default Store;
