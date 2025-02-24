"use server";

import { revalidatePath } from "next/cache";

export const revalidateAction = async (path: string) => {
  revalidatePath(path);
};
