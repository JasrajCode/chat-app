import { connectToDB } from "@lib/mongodb";
import { pusherServer } from "@lib/pusher";
import Message from "@models/Message";
import Chat from "@models/Chat";
import User from "@models/User";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatId, currentUserId, text } = body;

    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: { 
          path: "sender seenBy", 
          model: "User"
        },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    // Notify all members of the chat about the new message
    await pusherServer.trigger(chatId, "new-message", newMessage)

    // Notify each member individually about the updated chat, including the latest message
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    
    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage]
        });
      } catch (e) {
        console.error(`Failed to trigger update-chat event`);
      }
    });

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create new message", { status: 500 });
  }
};
