"use client";

import { useDispatch, useSelector } from "react-redux";
import { signUpOrLogin } from "../../redux/slices/authSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const auth = useSelector((s: RootState) => s.auth);

  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated) router.replace("/board");
  }, [auth.isAuthenticated, router]);

  const validate = () => {
    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passOK = password.length >= 6;
    if (!emailOK) return "Enter a valid email address.";
    if (!passOK) return "Password must be at least 6 characters.";
    return null;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    dispatch(signUpOrLogin({ email }));
    router.replace("/board");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-900 backdrop-blur-2xl">
      <div className="w-full max-w-md bg-gray-700 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
        <h1 className="text-white text-xl font-semibold">Sign in / Sign up</h1>
        <p className="text-gray-200 text-sm mt-1">
          Demo auth persisted in localStorage.
        </p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className=" text-white text-sm">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-3 py-2 text-white placeholder-gray-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="text-white text-sm">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-3 py-2 text-white placeholder:text-gray-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {err && <div className="text-sm text-red-300">{err}</div>}
          <button className="w-full rounded-xl bg-white/20 py-2 border border-white/30 hover:bg-white/30 transition backdrop-blur-sm text-white placeholder:text-gray-200 cursor-pointer">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
