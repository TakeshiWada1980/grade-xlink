"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupRequestSchema } from "@/app/_types/Signup";
import type { SignupRequest } from "@/app/_types/Signup";
import type { AuthUser } from "@/app/_types/AuthUser";

export const signupAction = async (formValues: SignupRequest) => {
  // 入力検証（必要に応じて再度サーバー側で検証）
  const payload = signupRequestSchema.parse(formValues);

  // 既存ユーザのチェック
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // ユーザの作成
  const user = await prisma.user.create({
    data: {
      email: payload.email,
      password: hashedPassword,
      name: payload.name,
    },
  });

  const authUser: AuthUser = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return authUser;
};
