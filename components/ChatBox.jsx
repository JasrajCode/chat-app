"use client";

import { useState, useEffect, useRef } from "react";
import { IoIosPaperPlane } from "react-icons/io";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@lib/pusher";

const ChatBox = ({ chatId }) => {
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [chat, setChat] = useState({});
  const [otherMembers, setOtherMembers] = useState([]);

  const { data: session } = useSession();
  const currentUser = session?.user;

  const [text, setText] = useState("");

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setChat(data);
      setOtherMembers(
        data?.members?.filter((member) => member._id !== currentUser._id)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  const sendText = async () => {
    if (!text.trim()) return;
    setDisabled(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          text,
        }),
      });

      if (res.ok) {
        setText("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
    }
  };

  useEffect(() => {
    pusherClient.subscribe(chatId);

    const handleMessage = async (newMessage) => {
      setChat((prevChat) => {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        };
      });
    };

    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMessage);
    };
  }, [chatId]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !disabled) {
      sendText();
    }
  };

  return loading ? (
    <Loader />
  ) : (
      <div className="sm:h-[600px]">
        <div className="bg-gray-800 text-white rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-xl font-bold cursor-default select-none">
              {otherMembers[0].username.charAt(0).toUpperCase()}
            </div>
              
            <p className="text-2xl sm:text-3xl font-bold">{otherMembers[0].username}</p>
          </div>
      
          <div className="h-[350px] sm:h-[400px] overflow-auto flex flex-col gap-4 bg-gray-700 p-4 rounded-lg overflow-y-scroll custom-scrollbar">
            {chat?.messages?.map((message, index) => (
              <MessageBox key={index} message={message} currentUser={currentUser} />
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center mt-4 bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center gap-4 flex-1">
              <input
                type="text"
                placeholder="Write a message..."
                className="w-full bg-transparent text-white outline-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />
            </div>
      
            <div 
              onClick={!disabled ? sendText : null} 
              className={disabled ? 'opacity-50 cursor-default' : 'cursor-pointer'}
            >
              <IoIosPaperPlane className="w-12 h-12 p-2 rounded-full bg-green-600 ml-2"/>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ChatBox;
