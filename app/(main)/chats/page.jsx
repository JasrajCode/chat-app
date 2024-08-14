import ChatList from "@components/ChatList"

const Chats = () => {
  return (
    <div className="h-[calc(100vh-80px)] flex items-center px-2 sm:px-10 ">
      <div className="w-1/3 max-lg:w-full">
        <ChatList />
      </div>
    </div>
  )
}

export default Chats