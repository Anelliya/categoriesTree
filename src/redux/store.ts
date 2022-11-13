import { configureStore } from '@reduxjs/toolkit';

import {
    categoriesReducer,
    categoriesChildrenReducer,
    filterReducer,
} from './categorySlice';

const store = configureStore({
    reducer: {
        categories: categoriesReducer,
        categoriesChildren: categoriesChildrenReducer,
        filter: filterReducer,
    },
    devTools: process.env.NODE_ENV === 'development',
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
