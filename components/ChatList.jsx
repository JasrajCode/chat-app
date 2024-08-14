"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ChatListContact from "./ChatListContact";
import Loader from "./Loader";
import { pusherClient } from "@lib/pusher";
import Link from "next/link";

const ChatList = ({ currentChatId }) => {
  const { data: sessions } = useSession();
  const currentUser = sessions?.user;

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const getChats = async () => {
    try {
      const res = await fetch(
        search !== ""
          ? `/api/users/${currentUser._id}/searchChat/${search}`
          : `/api/users/${currentUser._id}`
      );
      const data = await res.json();
      setChats(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, search]);

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser._id);

      const handleChatUpdate = (updatedChat) => {
        setChats((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              return { ...chat, messages: updatedChat.messages };
            } else {
              return chat;
            }
          })
        );
      };

      const handleNewChat = (newChat) => {
        setChats((allChats) => [...allChats, newChat]);
      };

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);

  return loading ? (
    <Loader />
  ) : (
    <div className="h-[550px] sm:h-[600px] flex flex-col gap-8 sm:gap-6 bg-gray-800 rounded-2xl py-10 px-5">
      <input
        placeholder="Search chat..."
        className="w-full px-5 py-3 rounded-lg bg-gray-700"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex-1 flex flex-col px-0.5 overflow-auto ">
        {chats?.map((chat, index) => (
          <ChatListContact
            key={chat._id}
            chat={chat}
            index={index}
            currentUser={currentUser}
            currentChatId={currentChatId}
          />
        ))}

      </div>

      <Link href="/create-chat">
        <button className="w-full px-5 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300">
          Create New Chat
        </button>
      </Link>
    </div>
  );
};

export default ChatList;
