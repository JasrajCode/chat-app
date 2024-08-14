import { pusherServer } from "@lib/pusher";
import { connectToDB } from "@lib/mongodb";
import Chat from "@models/Chat";
import User from "@models/User";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();
    const { currentUserId, members } = body;

    // Query to find an existing one-on-one chat between the current user and the specified member
    const query = { members: { $all: [currentUserId, ...members], $size: 2 } };

    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = await new Chat({ members: [currentUserId, ...members] });
      await chat.save();

      // Update each member to include the new chat
      const updateAllMembers = chat.members.map(async (memberId) => {
        await User.findByIdAndUpdate(
          memberId,
          {
            $addToSet: { chats: chat._id },
          },
          { new: true }
        );
      });
      await Promise.all(updateAllMembers);

      // Notify each member about the creation of the new chat
      const notifyMembers = chat.members.map(async (member) => {
        await pusherServer.trigger(member._id.toString(), "new-chat", chat);
      });
      await Promise.all(notifyMembers);
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to create a new chat", { status: 500 });
  }
};
