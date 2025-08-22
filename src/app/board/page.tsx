"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import KanbanBoard from "../../components/Dashboard/KanbanBoard";
import Header from "@/components/Dashboard/Header";

export default function BoardPage() {
  const auth = useSelector((s: RootState) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated) router.replace("/login");
  }, [auth.isAuthenticated, router]);
  if (!auth.isAuthenticated) return null;

  return (
    <div className="px-4 py-4">
      <Header />
      <KanbanBoard />
    </div>
  );
}
