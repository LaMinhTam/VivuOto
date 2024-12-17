import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, IUser } from "./types";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isRecheckToken: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<IUser>) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setIsReCheckToken: (state, action: PayloadAction<boolean>) => {
      state.isRecheckToken = action.payload;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, setIsReCheckToken } =
  authSlice.actions;
export default authSlice.reducer;
