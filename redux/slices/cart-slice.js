'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openCart: false,
  cartLoading: false,
  totalLoading: false,
  diffShipAddress: false,
  cartSection: 'CART',
  checkoutSuccess: false,
  paymentMethod: 'cod',
  changeShipping: true,
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
    setTotalLoading: (state, action) => {
      state.totalLoading = action.payload;
    },
    setChangeShipping: (state, action) => {
      state.changeShipping = action.payload;
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
  setTotalLoading,
  setChangeShipping,
} = cartSlice.actions;

export default cartSlice.reducer;
