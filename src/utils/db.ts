import { UserType } from "@/types/UserType";

const BACKEND_URL = process.env.BACKEND_URL;

const createUser = async (
  payload: Omit<UserType, "id" | "createdAt" | "updatedAt">
) => {
  const now = new Date();
  const res = await fetch(BACKEND_URL + `/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload, createdAt: now, updatedAt: now }),
  });
  const user = await res.json();
  return user;
};

const getUserById = async (id: string) => {
  const res = await fetch(BACKEND_URL + `/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const user = await res.json();
  return user;
};

const getUserByGoogleSub = async (googleSub: string) => {
  const res = await fetch(BACKEND_URL + `/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const users = (await res.json()) as UserType[];
  return users.find((user) => user.googleSub === googleSub);
};

const createOrGetUser = async (
  payload: Omit<UserType, "id" | "createdAt" | "updatedAt">
) => {
  const { googleSub } = payload;
  const user = await getUserByGoogleSub(googleSub);
  if (user) return user;
  return await createUser(payload);
};

export { createUser, getUserById, createOrGetUser };
