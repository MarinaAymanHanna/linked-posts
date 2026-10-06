import { Input, Spinner } from "@heroui/react";
import { useForm } from "react-hook-form";
import * as Zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendLoginData } from "../Services/login";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

const schema = Zod.object({
  email: Zod.string()
    .trim()
    .nonempty("Email or username is required"),
  password: Zod.string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    if (loading) return;

    setLoading(true);
    setApiError(null);

    try {
      const response = await sendLoginData(values);

      if (!response.success) {
        setApiError(response.message || "Incorrect email or password");
        toast.error(response.message || "Login failed");
        return;
      }

      login(response.data.token, response.data.user);
      toast.success(`Welcome back${response.data?.user?.name ? `, ${response.data.user.name}` : ""}!`);
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/40 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-3">
            <span className="font-extrabold text-2xl tracking-tighter">LP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">LinkedPosts</h1>
          <p className="text-sm text-slate-500 mt-1">Connect, share and engage with your community</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/50 p-7 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email / Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Email or Username
              </label>
              <div className="relative">
                <Input
                  {...register("email")}
                  placeholder="name@example.com or username"
                  type="text"
                  className="w-full pl-9 text-sm"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.email?.message && (
                <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 block">
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-9 pr-10 text-sm"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password?.message && (
                <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {apiError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium text-center">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] transition shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}