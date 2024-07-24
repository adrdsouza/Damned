'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openCart: false,
  cartLoading: false,
  diffShipAddress: false,
  cartSection: 'CART',
  checkoutSuccess: false,
};

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    setCartOpen: (state) => {
      state.openCart = true;
    },
    setCartClose: (state) => {
      state.openCart = false;
    },
    setCartLoading: (state, action) => {
      state.cartLoading = action.payload;
    },
    setDiffShipAddress: (state, action) => {
      state.diffShipAddress = action.payload;
    },
    setCartSection: (state, action) => {
      state.cartSection = action.payload;
    },
  },
});

export const {
  setCartOpen,
  setCartClose,
  setCartLoading,
  setDiffShipAddress,
  setCartSection,
} = cartSlice.actions;

export default cartSlice.reducer;
