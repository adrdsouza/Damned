'use client';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import cartSlice from './slices/cart-slice';
import ordersSlice from './slices/orders-slice';
import productsSlice from './slices/products-slice';

const store = configureStore({
  reducer: combineReducers({
    cartSlice,
    ordersSlice,
    productsSlice,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const { dispatch, getState } = store;

export default store;
