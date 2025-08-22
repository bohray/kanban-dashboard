"use client";

import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../redux/slices/boardSlice";
import { logout } from "../../redux/slices/authSlice";
import { AppDispatch, RootState } from "../../redux/store";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const { labels, filters } = useSelector((s: RootState) => s.board);
  const { email } = useSelector((s: RootState) => s.auth);

  const name = email?.split("@")[0] || "User";

  function capitalizeFirstLetter(str: string) {
    if (!str) return ""; // handle empty string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Vulnerabilities</h2>
        <div className="flex gap-2.5">
          <div className="flex items-center px-4 py-1 text-sm rounded-xl border border-gray-300">
            {capitalizeFirstLetter(name)}
          </div>
          <button
            className="cursor-pointer rounded-xl px-3 py-2 bg-red-700 hover:bg-red-600 text-white"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex w-full flex-wrap gap-2">
        <div className="relative">
          <input
            className="w-64 rounded-xl border border-gray-300 px-3 py-2"
            placeholder="Search by issue name..."
            value={filters.query}
            onChange={(e) => dispatch(setFilters({ query: e.target.value }))}
          />
        </div>
        <select
          className="rounded-xl border border-gray-300 px-3 py-2"
          value={filters.label ?? "All"}
          onChange={(e) => dispatch(setFilters({ label: e.target.value }))}
        >
          <option>All</option>
          {labels.map((l) => (
            <option key={l.title}>{l.title}</option>
          ))}
        </select>
        <select
          className="rounded-xl border border-gray-300 px-3 py-2"
          value={filters.sort}
          onChange={(e) =>
            dispatch(
              setFilters({ sort: e.target.value as "newest" | "oldest" })
            )
          }
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
}
