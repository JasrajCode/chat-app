import { connectToDB } from "@lib/mongodb";
import User from "@models/User"

export const GET = async (req, { params }) => {
  try {
    await connectToDB()

    const { query } = params

    const searchedContacts = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    })

    return new Response(JSON.stringify(searchedContacts), { status: 200 })
  } catch (error) {
    return new Response("Failed to search contact", { status: 500 })
  }
}