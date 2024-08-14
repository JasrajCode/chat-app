"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { IoCheckmarkCircle, IoRadioButtonOff } from "react-icons/io5";
import { useRouter } from "next/navigation";

const CreateChat = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  const currentUser = session?.user;

  const getContacts = async () => {
    try {
      const res = await fetch(
        search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
      );
      const data = await res.json();
      setContacts(data.filter((contact) => contact._id !== currentUser._id));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, search]);

  /* SELECT CONTACT */
  const [selectedContact, setSelectedContact] = useState(null);

  const handleSelect = (contact) => {
    setSelectedContact((prev) => (prev === contact ? null : contact));
  };

  /* CREATE CHAT */
  const router = useRouter();

  const createChat = async () => {
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUserId: currentUser._id,
        members: [selectedContact._id]
      }),
    });
    const chat = await res.json();

    if (res.ok) {
      router.push(`/chats/${chat._id}`);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-[calc(100vh-88px)] text-white p-4">
      <div className="flex flex-col p-6 bg-gray-800 rounded-2xl max-w-2xl max-h-[calc(100vh-115px)] mx-auto">
        <input
          placeholder="Search contact..."
          className="mb-4 p-3 rounded-lg bg-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <p className="text-lg font-bold mb-2">Select a Contact</p>

        <div className="flex flex-col flex-1 gap-2 sm:gap-3 overflow-y-auto">
          <div className="flex flex-col">
            {contacts.map((user, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
                onClick={() => handleSelect(user)}
              >
                {selectedContact === user ? (
                  <IoCheckmarkCircle className="text-green-500 scale-150 m-1" />
                ) : (
                  <IoRadioButtonOff className="text-gray-400 scale-150 m-1" />
                )}

                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold select-none ml-2">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                
                <p className="ml-3 text-base font-bold">{user.username}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className={`mt-4 w-full p-3 rounded-lg bg-green-500 font-bold ${
            !selectedContact ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
          onClick={createChat}
          disabled={!selectedContact}
        >
          START A NEW CHAT
        </button>
      </div>
    </div>    
  );
};

export default CreateChat;
