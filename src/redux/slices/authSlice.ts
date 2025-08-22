import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadJSON, saveJSON } from "../../lib/storage";

type AuthState = { isAuthenticated: boolean; email: string | null };
const initial: AuthState = loadJSON<AuthState>("auth") ?? {
  isAuthenticated: false,
  email: null,
};

const slice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    signUpOrLogin: (s, a: PayloadAction<{ email: string }>) => {
      s.isAuthenticated = true;
      s.email = a.payload.email;
      saveJSON("auth", s);
    },
    logout: (s) => {
      s.isAuthenticated = false;
      s.email = null;
      saveJSON("auth", s);
    },
  },
});
export const { signUpOrLogin, logout } = slice.actions;
export default slice.reducer;
