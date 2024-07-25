'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openCart: false,
  cartLoading: false,
  checkingOut: false,
  diffShipAddress: false,
  cartSection: 'CART',
  checkoutSuccess: false,
  paymentMethod: 'cod',
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
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setCheckingOut: (state, action) => {
      state.checkingOut = action.payload;
    },
  },
});

export const {
  setCartOpen,
  setCartClose,
  setCartLoading,
  setDiffShipAddress,
  setCartSection,
  setPaymentMethod,
  setCheckingOut,
} = cartSlice.actions;

export default cartSlice.reducer;
