import { UserType } from "@/types/UserType";
import { createContext, Dispatch, SetStateAction } from "react";

export const UserContext = createContext<{
  user?: UserType;
  setUser?: Dispatch<SetStateAction<UserType | undefined>>;
}>({ user: undefined, setUser: undefined });
