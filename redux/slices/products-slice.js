'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: {
    chef: null,
    pocket: null,
    fixed: null,
    edc: null,
    sidekick: null,
  },
};

const productsSlice = createSlice({
  name: 'productsSlice',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productsSlice.actions;

export default productsSlice.reducer;
