'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: null,
};

const ordersSlice = createSlice({
  name: 'ordersSlice',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
