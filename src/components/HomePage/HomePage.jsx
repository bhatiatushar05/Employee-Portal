// HomePage.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LogIn,
  ImageIcon,
} from "lucide-react";

const HomePage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // wire to real auth
    onLogin?.({ fullName: "HITS User", email });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background accents: blue + orange */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-16 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl"></div>
        <div className="absolute bottom-8 left-1/3 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl"></div>
      </div>

      <div
        className={`relative z-10 flex min-h-screen transition-opacity duration-700 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Left: Brand + message */}
        <aside className="hidden lg:flex lg:w-1/2 items-center justify-center px-14">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <Building2 className="h-11 w-11 text-cyan-400" />
                <Sparkles className="h-6 w-6 text-orange-300 absolute -top-2 -right-2 animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white">
                  HITS
                </h1>
                <p className="text-sm text-cyan-200/90">
                  Employee Operating System
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">
              Hi 👋 Welcome back to HITS
            </h2>
            <p className="text-slate-300 mb-8">
              Sign in to manage your work, track expenses, and get things done.
            </p>

            {/* Feature highlights */}
            <ul className="space-y-3">
              {[
                ["Secure access control", ShieldCheck],
                ["Smart expense tracking", User],
                ["Clean, focused dashboards", ImageIcon],
              ].map(([label, Icon], i) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                  style={{ animationDelay: `${150 * i}ms` }}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-md">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-slate-200">{label}</span>
                </li>
              ))}
            </ul>
            
          </div>
        </aside>

        {/* Right: Sign in */}
        <main className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 py-14">
          <div className="w-full max-w-md">
            {/* Compact logo for mobile */}
            <div className="lg:hidden mb-8 text-center">
              <div className="mx-auto mb-3 flex items-center justify-center gap-3">
                <Building2 className="h-10 w-10 text-cyan-400" />
                <span className="text-3xl font-extrabold text-white">HITS</span>
              </div>
              <p className="text-slate-300">Employee Operating System</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <h3 className="text-2xl font-bold text-white">Sign in to your account</h3>
              <p className="mt-2 text-sm text-slate-300">
                Don’t have an account?
                <a href="#" className="ml-1 text-cyan-300 hover:text-cyan-200">
                  Contact the Admin for your credentials
                </a>
              </p>

              <form onSubmit={handleSignIn} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-400 outline-none ring-0 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-12 text-white placeholder-slate-400 outline-none ring-0 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                      placeholder="6+ characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-slate-300">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-transparent text-cyan-500 focus:ring-cyan-400"
                    />
                    <span className="ml-2">Remember me</span>
                  </label>
                  <a href="#" className="text-orange-300 hover:text-orange-200">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-cyan-600 hover:to-orange-600 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center">
                      <span className="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                      Signing in…
                    </span>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                      Sign in
                    </>
                  )}
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-transparent px-3 text-xs text-slate-400">OR</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-medium text-slate-100 hover:bg-white/10"
                >
                  Continue with Google
                </button>
              </form>
            </div>

            <p className="mt-4 text-center text-sm text-slate-400">
              Need access?
              <a href="#" className="ml-1 text-cyan-300 hover:text-cyan-200">
                Contact the Admin
              </a>
            </p>
          </div>
        </main>
        
        {/* Footer Blank Space */}
        <div className="h-16 sm:h-20 md:h-24"></div>
      </div>

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
