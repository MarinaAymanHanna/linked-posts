import { Input, Spinner } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendRegisterData } from "../Services/register";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { schema } from "../Schema/RegisterSchema.jsx";
import toast from "react-hot-toast";
import { UserPlus, User, AtSign, Mail, Lock, Calendar, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "male",
    },
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  async function signUp(values) {
    if (loading) return;

    setLoading(true);
    setApiError(null);

    try {
      const response = await sendRegisterData(values);

      if (!response.success) {
        setApiError(response.message || "Registration failed");
        toast.error(response.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/40 to-slate-200 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-3">
            <span className="font-extrabold text-2xl tracking-tighter">LP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">Join the community on LinkedPosts</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          <form onSubmit={handleSubmit(signUp)} className="space-y-4">
            {/* Full Name & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Full Name</label>
                <div className="relative">
                  <Input
                    {...register("name")}
                    placeholder="John Doe"
                    type="text"
                    className="w-full pl-9 text-sm"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.name?.message && (
                  <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Username</label>
                <div className="relative">
                  <Input
                    {...register("username")}
                    placeholder="johndoe"
                    type="text"
                    className="w-full pl-9 text-sm"
                  />
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.username?.message && (
                  <p className="text-xs text-rose-500 font-medium">{errors.username.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
              <div className="relative">
                <Input
                  {...register("email")}
                  placeholder="user@example.com"
                  type="email"
                  className="w-full pl-9 text-sm"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.email?.message && (
                <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Password</label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    placeholder="Password@123"
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-9 pr-8 text-sm"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password?.message && (
                  <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Confirm Password</label>
                <div className="relative">
                  <Input
                    {...register("rePassword")}
                    placeholder="Repeat password"
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-9 text-sm"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.rePassword?.message && (
                  <p className="text-xs text-rose-500 font-medium">{errors.rePassword.message}</p>
                )}
              </div>
            </div>

            {/* Date of Birth & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Date of Birth</label>
                <div className="relative">
                  <input
                    {...register("dateOfBirth")}
                    type="date"
                    className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.dateOfBirth?.message && (
                  <p className="text-xs text-rose-500 font-medium">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Gender</label>
                <select
                  {...register("gender")}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition capitalize"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender?.message && (
                  <p className="text-xs text-rose-500 font-medium">{errors.gender.message}</p>
                )}
              </div>
            </div>

            {apiError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium text-center">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] transition shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="white" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
