import { format } from "date-fns";
import { useRouter } from "next/navigation";

const ChatListContact = ({ chat, currentUser, currentChatId }) => {
  const otherMembers = chat?.members?.filter(
    (member) => member._id !== currentUser._id
  );

  const lastMessage =
    chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];

  const seen = lastMessage?.seenBy?.find(
    (member) => member._id === currentUser._id
  );

  const router = useRouter();

  return (
    <div
      className={`flex p-3 my-0.5 rounded-lg cursor-pointer hover:bg-gray-700  ${
        chat._id === currentChatId ? "bg-gray-600" : ""
      }`}
      onClick={() => router.push(`/chats/${chat._id}`)}
    >
      <div className="flex flex-1 gap-3 ">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold select-none">
          {otherMembers[0].username.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold text-white">{otherMembers[0]?.username}</p>

          {!lastMessage && <p className="font-semibold text-sm">Started a chat</p>}

          <p
            className={`truncate w-full ${
              seen ? "font-medium text-sm text-gray-400" : "font-semibold text-sm"
            }`}
          >
            {lastMessage?.text}
          </p>
        </div>
      </div>

      <div>
        <p className="font-light text-base text-gray-400">
          {!lastMessage
            ? format(new Date(chat?.createdAt), "p")
            : format(new Date(chat?.lastMessageAt), "p")}
        </p>
      </div>
    </div>
  );
};

export default ChatListContact;
