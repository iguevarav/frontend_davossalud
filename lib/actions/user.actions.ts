"use server";

import { getSession } from "./auth.actions";
import { getUsers } from "../services/user";

export async function getUsersAction(filters?: { withoutStaff?: boolean }) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");
  return await getUsers(token, filters);
}
