import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthType {
  isAutheticated: boolean;
}

const initialState: AuthType = {
  isAutheticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthType>) => {
      return action.payload;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;
