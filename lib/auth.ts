import { headers } from "next/headers";
import { verifyToken } from "./jwt";

export interface AuthUser {
  sub: string;
  email: string;
  role: "ADMIN" | "USER";
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    return decoded as AuthUser | null;
  } catch (error) {
    return null;
  }
}

export async function verifyAdmin(): Promise<AuthUser | null> {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}
