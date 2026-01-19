import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart } from "../../types/Types";

interface CartItem extends Cart {
  productTitle?: string;
  productPrice?: number;
  productImage?: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  itemCount: 0,
};

// Helper function to recalculate totals
const recalculateTotals = (state: CartState) => {
  state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalAmount = state.items.reduce(
    (sum, item) => sum + (item.productPrice || 0) * item.quantity,
    0,
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      recalculateTotals(state);
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      recalculateTotals(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      recalculateTotals(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        recalculateTotals(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.itemCount = 0;
    },
  },
});

export const { setCart, addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
