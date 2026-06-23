"use client";

import { useEffect, useState } from "react";
import KanbanBoard from "@/components/Dashboard/KanbanBoard";
import Header from "@/components/Dashboard/Header";

export default function Home() {
  // The board is restored from localStorage, which is unavailable during SSR.
  // Gate on mount so the first client render matches the server, then render
  // once the persisted store is available — avoids a hydration mismatch.
  const [mounted, setMounted] = useState(false);

  // Intentional one-shot client-mount gate: flipping state once on mount is the
  // documented way to defer the localStorage-backed render past SSR.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const background = {
    backgroundColor: "#f8fafc",
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(6,182,212,0.25) 1px, transparent 0)",
    backgroundSize: "16px 16px",
  };

  // Until mounted, render a column skeleton instead of a blank screen. Markup is
  // identical on the server and the first client render, so it can't introduce a
  // hydration mismatch.
  if (!mounted) {
    return (
      <div
        className="flex h-screen flex-col overflow-hidden px-4 py-4"
        style={background}
      >
        <div className="mb-4 h-9 w-48 animate-pulse rounded-xl bg-gray-200" />
        <div className="flex flex-1 items-stretch gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-full w-80 shrink-0 animate-pulse rounded-2xl border border-gray-200 bg-white/60"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col overflow-hidden px-4 py-4"
      style={background}
    >
      <Header />
      <KanbanBoard />
    </div>
  );
}
