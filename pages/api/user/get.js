import { getSession } from "next-auth/client";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

export default async function handler(req, res) {
  const client = await connectToDatabase();
  const usersCollection = await client.db().collection("users");
  const user = await usersCollection.find({}).toArray();
  console.log(user)
  res.status(200).json({ message: user });
  client.close();

}
