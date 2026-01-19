import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "types/Types";

// Set the initial state
const initialState: User = {
  id: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  name: "",
  email: "",
  phone: "",
  avatarUrl: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
};

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    clearUser: (state) => {
      return initialState;
    },
  },
});

// Export actions
export const { setUser, updateUser, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
