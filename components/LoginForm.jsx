"use client";

import { CiMail, CiLock } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react"
import { useState } from "react";
import Link from "next/link";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    

    if (res.ok) {
      router.push("/chats");
      setLoading(false);
    }

    if (res.error) {
      setLoading(false);
      setErrorMessage("Invalid email or password");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000); // Hide the error message after 3 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl px-3 mb-12 sm:text-5xl sm:px-0">Log in to your account</h1>
      
      {/* Goal: Add animation */}
      {showError && (
        <div className="fixed top-10 p-3 sm:top-12 sm:p-4 bg-red-400 rounded-md select-none">
          <p className="text-white text-center">{errorMessage}</p>
        </div>
      )}

      <form className="px-3 w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-base mb-2">Email</label>
          <div className="flex items-center relative">
            <input
              defaultValue=""
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email"
              className="w-full p-4 pr-12 border border-gray-700 rounded-lg bg-gray-800 text-white outline-none"
            />
          <CiMail className="text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 scale-150"/>
          </div>
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-base mb-2">Password</label>
          <div className="flex items-center relative">
            <input
              defaultValue=""
              {...register("password", {
                required: "Password is required",
                validate: (value) => {
                  if (
                    value.length < 5 ||
                    !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                  ) {
                    return "Password must be at least 5 characters and contain at least one special character";
                  }
                },
              })}
              type="password"
              placeholder="Password"
              className="w-full p-4 pr-12 border border-gray-700 rounded-lg bg-gray-800 text-white outline-none"
            />
            <CiLock className="text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 scale-150"/>
          </div>
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        
        {/* Sign in button */}
        <button 
          className={`w-full p-4 mb-4 rounded-lg text-lg ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`} 
          disabled={loading} // Disable button when loading
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <Link href="/register" className="text-blue-500 hover:text-white flex justify-center transition duration-300 ease-in-out transform">
          Don't have an account? Sign Up
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
