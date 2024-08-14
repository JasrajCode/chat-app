"use client";

import Loader from "@components/Loader";
import { CiUser } from "react-icons/ci";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ProfileDetails = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
      });
    }
    setLoading(false);
  }, [user]);

  const {
    register,
    reset,
    handleSubmit,
    formState: { error },
  } = useForm();

  const updateUser = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-[calc(100vh-88px)] text-white flex flex-col items-center justify-center px-2 sm:px-0">
      <h1 className="text-3xl sm:text-4xl mb-4">Edit your username</h1>
      <form
        className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg"
        onSubmit={handleSubmit(updateUser)}
      >
        <div className="mb-4 relative">
          <input
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
            className="w-full p-3 pl-4 pr-12 bg-gray-700 border border-gray-600 rounded-2xl text-white"
          />
          <CiUser className="text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 scale-150"/>
        </div>
        {error?.username && (
          <p className="text-red-500 text-center">{error.username.message}</p>
        )}

        <button
          className="w-full py-3 mt-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-lg font-bold text-white transition duration-300 ease-in-out "
          type="submit"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileDetails;
