"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { JWT } from "@/lib/auth";
import { loginRequestSchema } from "@/app/_types/Login";
import type { AuthUser } from "@/app/_types/AuthUser";
import type { LoginRequest } from "@/app/_types/Login";

export const loginAction = async (loginRequest: LoginRequest) => {
  try {
    const payload = loginRequestSchema.parse(loginRequest);

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
      payload.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = await JWT.sign({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      secure: false, // https のみの場合 true
    });

    const authUser: AuthUser = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return authUser;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};
