import { getSession } from "next-auth/client";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";
import { ObjectId } from 'bson';
export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return;
  }
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }
  const id = req.body.id;

  const client = await connectToDatabase();
  const usersCollection = await client.db().collection("users");
  const result = await usersCollection.deleteOne({ _id: ObjectId(id) });
  client.close();
  res.status(200).json({ message: "User deleted!" });
}
