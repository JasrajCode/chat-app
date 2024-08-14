"use client";

import { CiUser, CiMail, CiLock } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const onSubmit = async (data) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/");
    }

    if (res.error) {
      setErrorMessage("Something went wrong");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000); // Hide the error message after 3 seconds
    }
  };

  return (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <h1 className="text-3xl mb-6 sm:mb-12 sm:text-5xl">Create your account</h1>
    
    {/* Add animation later */}
    {showError && (
      <div className="fixed top-4 p-3 sm:top-8 sm:p-4 bg-red-400 rounded-md select-none">
        <p className="text-white text-center">{errorMessage}</p>
      </div>
    )}
  
    <form className="px-3 w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
      {/* Username Input */}
      <div className="mb-6">
        <label className="block text-base mb-2">Username</label>
        <div className="flex items-center relative">
          <input
            defaultValue=""
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="w-full p-4 pr-12 border border-gray-700 rounded-lg bg-gray-800 text-white outline-none"
          />
          <CiUser className="text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 scale-150"/>
        </div>
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
      </div>
  
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
  
      {/* Sign Up button */}
      <button className="w-full p-4 mb-4 bg-blue-600 rounded-lg text-lg" type="submit">
        Sign Up
      </button>
  
      <Link href="/" className="text-blue-500 hover:text-white flex justify-center transition duration-300 ease-in-out transform">
        Already have an account? Sign In Here
      </Link>
    </form>
  </div>
  );
};

export default RegisterForm;
