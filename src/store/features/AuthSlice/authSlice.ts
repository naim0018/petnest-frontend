import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export interface User {
  email: string;
  phone: string;
  userId: string;
  role: string;
  name?: string;
  accessToken?: string;
  refreshToken?: string;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let decoded: any = {};
      if (payload.accessToken) {
        try {
          decoded = jwtDecode(payload.accessToken as string) as User;
        } catch {
          // If decoding fails, continue with payload fields
        }
      }
      state.user = {
        email: payload.email || decoded.email || state.user?.email || "",
        userId: payload.id || payload.userId || decoded.userId || state.user?.userId || "",
        role: payload.role || decoded.role || state.user?.role || "USER",
        phone: payload.phone || decoded.phone || state.user?.phone || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: payload.name || decoded?.name || (state.user as any)?.name || "",
        accessToken: payload.accessToken || state.user?.accessToken || "",
        refreshToken: payload.refreshToken || state.user?.refreshToken || "",
      };
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { logOut, setUser } = authSlice.actions;
export default authSlice.reducer;
