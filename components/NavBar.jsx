"use client";

import { IoPersonCircleSharp } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="px-5 h-20 flex items-center justify-between bg-gray-800 shadow-lg">
      <div className="flex items-center">
        <Link
          href="/chats"
          className="text-white hover:text-gray-300 text-xl sm:text-2xl font-bold"
        >
          Chats
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <Link href="/profile">
          <IoPersonCircleSharp className="text-white hover:text-gray-300 scale-[2.5] sm:scale-[3]"/>
        </Link>

        <IoMdLogOut
          className="text-white scale-[2.4] sm:scale-[2.7] cursor-pointer"
          onClick={handleLogout}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FF5252")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
        />
      </div>
    </div>
  );
};

export default Navbar;
