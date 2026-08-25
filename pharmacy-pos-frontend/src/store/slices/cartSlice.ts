import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../features/products/types/product.types.js';
import { Customer } from '../../features/customers/types/customer.types.js';
import {
  CartItemModel,
  AppliedDiscount,
  AppliedInsurance,
  AppliedLoyalty,
} from '../../features/sales/types/checkout.types.js';

interface CartSliceState {
  items: CartItemModel[];
  customer: Customer | null;
  discount: AppliedDiscount | null;
  insurance: AppliedInsurance | null;
  loyalty: AppliedLoyalty | null;
  notes: string;
  subtotal: number;
  discountAmount: number;
  insuranceAmount: number;
  taxAmount: number;
  total: number;
}

const initialState: CartSliceState = {
  items: [],
  customer: null,
  discount: null,
  insurance: null,
  loyalty: null,
  notes: '',
  subtotal: 0,
  discountAmount: 0,
  insuranceAmount: 0,
  taxAmount: 0,
  total: 0,
};

function calculateTotals(state: CartSliceState) {
  let subtotal = 0;
  let taxAmount = 0;

  for (const item of state.items) {
    const itemSubtotal = item.quantity * item.unitPrice;
    item.subtotal = Number(itemSubtotal.toFixed(2));
    item.total = Number(Math.max(0, item.subtotal - (item.discount || 0)).toFixed(2));
    subtotal += item.total;

    if (item.product.taxRate && item.product.taxRate > 0) {
      taxAmount += (item.total * item.product.taxRate) / 100;
    }
  }

  state.subtotal = Number(subtotal.toFixed(2));
  state.taxAmount = Number(taxAmount.toFixed(2));

  // 1. Calculate General Discount (Percentage or Fixed)
  let discountAmount = 0;
  if (state.discount) {
    if (state.discount.type === 'PERCENTAGE') {
      discountAmount = (state.subtotal * state.discount.value) / 100;
    } else {
      discountAmount = state.discount.value;
    }
  }

  // 2. Customer Tier Discount (if applicable and no conflicting custom discount)
  const tierDiscountPct =
    state.customer?.tier?.discountPercentage ??
    state.customer?.loyalty?.tier?.discountPercentage;
  if (!state.discount && tierDiscountPct && tierDiscountPct > 0) {
    discountAmount = (state.subtotal * tierDiscountPct) / 100;
  }

  // 3. Loyalty points redemption
  if (state.loyalty?.discountAmount) {
    discountAmount += state.loyalty.discountAmount;
  }

  state.discountAmount = Number(Math.min(state.subtotal, discountAmount).toFixed(2));

  const afterDiscount = Math.max(0, state.subtotal - state.discountAmount);

  // 4. Insurance Coverage (if active policy selected)
  let insuranceAmount = 0;
  if (state.insurance && state.insurance.coveragePercentage > 0) {
    insuranceAmount = (afterDiscount * state.insurance.coveragePercentage) / 100;
  }
  state.insuranceAmount = Number(insuranceAmount.toFixed(2));

  // 5. Final Grand Total Due from Customer
  const grandTotal = Math.max(0, afterDiscount - state.insuranceAmount + state.taxAmount);
  state.total = Number(grandTotal.toFixed(2));
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
      } else {
        const unitPrice = product.sellingPrice || 0;
        const subtotal = Number((quantity * unitPrice).toFixed(2));
        state.items.push({
          product,
          productId: product.id,
          quantity,
          unitPrice,
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
        }
      }
      calculateTotals(state);
    },

    updateItemDiscount: (state, action: PayloadAction<{ productId: string; discount: number }>) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.discount = Math.max(0, action.payload.discount);
      }
      calculateTotals(state);
    },

    setCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.customer = action.payload;
      if (!action.payload) {
        state.insurance = null;
        state.loyalty = null;
      }
      calculateTotals(state);
    },

    setDiscount: (state, action: PayloadAction<AppliedDiscount | null>) => {
      state.discount = action.payload;
      calculateTotals(state);
    },

    setInsurance: (state, action: PayloadAction<AppliedInsurance | null>) => {
      state.insurance = action.payload;
      calculateTotals(state);
    },

    setLoyaltyRedemption: (state, action: PayloadAction<AppliedLoyalty | null>) => {
      state.loyalty = action.payload;
      calculateTotals(state);
    },

    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
      state.customer = null;
      state.discount = null;
      state.insurance = null;
      state.loyalty = null;
      state.notes = '';
      state.subtotal = 0;
      state.discountAmount = 0;
      state.insuranceAmount = 0;
      state.taxAmount = 0;
      state.total = 0;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  updateItemDiscount,
  setCustomer,
  setDiscount,
  setInsurance,
  setLoyaltyRedemption,
  setNotes,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
