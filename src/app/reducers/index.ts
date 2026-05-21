import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import { attachStore } from '../../store/storeRef';
import auth from '../reducers/auth';

// Only persist session (`data`); loading/error flags stay ephemeral.
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  // RN AsyncStorage can exceed the default 5s on cold start / slow emulators.
  // 0 = wait for storage (no early timeout that drops the real session).
  timeout: 0,
  blacklist: ['isLoading', 'isError', 'error', 'isBootstrapping'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
});

const sagaMiddleware = createSagaMiddleware();

export default () => {
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
  attachStore(store);
  const persistor = persistStore(store);

  return { store, persistor, runSaga: sagaMiddleware.run };
};
