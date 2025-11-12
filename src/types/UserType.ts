import { JwtPayload } from "jsonwebtoken";

export interface UserType extends JwtPayload {
  id: string;
  googleSub: string;
  email: string;
  fullName: string;
  name: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
