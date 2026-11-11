import { createSlice } from "@reduxjs/toolkit";

export interface User {
  email: string;
  phone: string;
  userId: string;
  role: string;
  name?: string;
}

interface AuthState {
  user: Partial<User> | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (!action.payload) return;
      const payload = action.payload;
      state.user = {
        email: payload.email || state.user?.email || "",
        userId: payload.id || payload.userId || state.user?.userId || "",
        role: payload.role || state.user?.role || "USER",
        phone: payload.phone || state.user?.phone || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: payload.name || (state.user as any)?.name || "",
      };
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { logOut, setUser } = authSlice.actions;
export default authSlice.reducer;
