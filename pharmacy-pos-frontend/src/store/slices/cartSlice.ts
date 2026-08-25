import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product, Customer } from '../../types/index.js';

interface CartSliceState {
  items: CartItem[];
  customer: Customer | null;
  discountPercentage: number;
  pointsToRedeem: number;
  redeemedDiscountAmount: number;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
}

const initialState: CartSliceState = {
  items: [],
  customer: null,
  discountPercentage: 0,
  pointsToRedeem: 0,
  redeemedDiscountAmount: 0,
  subtotal: 0,
  discountTotal: 0,
  taxTotal: 0,
  total: 0,
};

function calculateTotals(state: CartSliceState) {
  let subtotal = 0;
  for (const item of state.items) {
    subtotal += item.total;
  }
  state.subtotal = Number(subtotal.toFixed(2));

  // Percentage discount
  let percentageDiscount = 0;
  if (state.discountPercentage > 0) {
    percentageDiscount = (state.subtotal * state.discountPercentage) / 100;
  }

  // Customer tier discount if applicable
  let tierDiscount = 0;
  if (state.customer?.tier?.discountPercentage) {
    tierDiscount = (state.subtotal * state.customer.tier.discountPercentage) / 100;
  }

  const combinedDiscount = percentageDiscount + tierDiscount + state.redeemedDiscountAmount;
  state.discountTotal = Number(Math.min(state.subtotal, combinedDiscount).toFixed(2));

  const afterDiscount = Math.max(0, state.subtotal - state.discountTotal);
  state.total = Number(afterDiscount.toFixed(2));
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === product.id);

      if (existing) {
        existing.quantity += quantity;
        existing.subtotal = Number((existing.quantity * existing.unitPrice).toFixed(2));
        existing.total = existing.subtotal - existing.discount;
      } else {
        const subtotal = Number((quantity * product.sellingPrice).toFixed(2));
        state.items.push({
          product,
          productId: product.id,
          quantity,
          unitPrice: product.sellingPrice,
          subtotal,
          discount: 0,
          total: subtotal,
        });
      }
      calculateTotals(state);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      calculateTotals(state);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.productId);
        } else {
          item.quantity = action.payload.quantity;
          item.subtotal = Number((item.quantity * item.unitPrice).toFixed(2));
          item.total = item.subtotal - item.discount;
        }
      }
      calculateTotals(state);
    },
    setCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.customer = action.payload;
      calculateTotals(state);
    },
    setDiscountPercentage: (state, action: PayloadAction<number>) => {
      state.discountPercentage = action.payload;
      calculateTotals(state);
    },
    setLoyaltyRedemption: (
      state,
      action: PayloadAction<{ points: number; discountAmount: number }>
    ) => {
      state.pointsToRedeem = action.payload.points;
      state.redeemedDiscountAmount = action.payload.discountAmount;
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.customer = null;
      state.discountPercentage = 0;
      state.pointsToRedeem = 0;
      state.redeemedDiscountAmount = 0;
      state.subtotal = 0;
      state.discountTotal = 0;
      state.taxTotal = 0;
      state.total = 0;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  setCustomer,
  setDiscountPercentage,
  setLoyaltyRedemption,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
