"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "./auth.actions";
import { getUsers, createUser, updateUser, deleteUser, updateUserPassword, updateUserEmail } from "../services/user";

export async function getUsersAction(filters?: { withoutStaff?: boolean }) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");
  return await getUsers(token, filters);
}

export async function createUserAction(data: any) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  const newUser = await createUser(token, data);
  revalidatePath("/users");
  return newUser;
}

export async function updateUserAction(id: string, data: any) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  const updatedUser = await updateUser(token, id, data);
  revalidatePath("/users");
  return updatedUser;
}

export async function updateUserPasswordAction(id: string, data: any) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  await updateUserPassword(token, id, data);
  revalidatePath("/users");
}

export async function updateUserEmailAction(id: string, data: any) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  await updateUserEmail(token, id, data);
  revalidatePath("/users");
}

export async function deleteUserAction(id: string) {
  const token = await getSession();
  if (!token) throw new Error("UNAUTHORIZED");

  await deleteUser(token, id);
  revalidatePath("/users");
}
