import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import sliceReducer from './reducers/requestReducer';

const store = configureStore({
    reducer: sliceReducer,
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(newsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export default store;
