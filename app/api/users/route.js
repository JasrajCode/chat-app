import { connectToDB } from "@lib/mongodb";
import User from "@models/User"

export const GET = async (req, res) => {
  try {
    await connectToDB()

    const users = await User.find()

    return new Response(JSON.stringify(users), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response("Failed to get all users", { status: 500 })
  }
}