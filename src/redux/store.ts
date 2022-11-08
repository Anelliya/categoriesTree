import { configureStore } from '@reduxjs/toolkit';

import { nodeStatusReducer } from './nodesSlice'
import { categoriesReducer,categoriesChildrenReducer } from './categorySlice'

const store = configureStore({
  reducer: {
    nodesStatus: nodeStatusReducer,
    categories: categoriesReducer,
    categoriesChildren: categoriesChildrenReducer
  },
  devTools: process.env.NODE_ENV === 'development',
});

export default store;


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch