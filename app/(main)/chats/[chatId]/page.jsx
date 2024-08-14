"use client"

import ChatBox from "@components/ChatBox"
import ChatList from "@components/ChatList"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { useEffect } from "react"


const ChatPage = () => {
  const { chatId } = useParams()

  const { data: session } = useSession()
  const currentUser = session?.user

  const seenMessages = async () => {
    try {
      await fetch (`/api/chats/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentUserId: currentUser._id
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser && chatId) seenMessages()
  }, [currentUser, chatId])

  return (
    <div className="h-[calc(100vh-80px)] flex items-center px-2 sm:px-10">
      <div className="w-1/3 max-lg:hidden mr-4"><ChatList currentChatId={chatId}/></div>
      <div className="w-2/3 max-lg:w-full"><ChatBox chatId={chatId}/></div>
    </div>
  )
}

export default ChatPage