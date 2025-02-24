"use server";

import { cookies } from "next/headers";

export const logoutAction = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.set("auth-token", "", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
      secure: false,
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};
