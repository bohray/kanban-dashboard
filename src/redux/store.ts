import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./slices/boardSlice";
import { saveJSON } from "../lib/storage";

export const store = configureStore({
  reducer: { board: boardReducer },
  middleware: (g) => g({ serializableCheck: false }),
});

// Persist the board outside the reducers (which stay pure). Debounced so a
// burst of dispatches — e.g. typing in the search filter — collapses into a
// single localStorage write.
let saveTimer: ReturnType<typeof setTimeout> | null = null;
store.subscribe(() => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveJSON("board", store.getState().board), 250);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
