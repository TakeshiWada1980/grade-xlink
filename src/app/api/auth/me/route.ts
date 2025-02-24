import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { JWT } from "@/lib/auth"; // JWT.sign() を利用しているライブラリと同じものを利用してください。
import { AppErrorCode } from "@/app/_types/AppErrorCode";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@/app/_types/ApiResponse";
import { AuthUserDTO } from "@/app/_types/AuthUserDTO";

export const dynamic = "force-dynamic"; // キャッシュを無効化

export const GET = async (req: NextRequest) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    const res: ApiErrorResponse = {
      success: false,
      httpStatus: 200,
      data: null,
      error: {
        appErrorCode: AppErrorCode.UNAUTHORIZED,
        description: "Cookieにトークンが含まれていません",
        metadata: { token },
      },
    };
    return NextResponse.json(res, { status: 200 });
  }

  const payload = await JWT.verify(token);
  if (!payload) {
    const res: ApiErrorResponse = {
      success: false,
      httpStatus: 200,
      data: null,
      error: {
        appErrorCode: AppErrorCode.UNAUTHORIZED,
        description: "検証に失敗した無効なトークン",
        metadata: { token },
      },
    };
    return NextResponse.json(res, { status: 200 });
  }

  const res: ApiSuccessResponse<AuthUserDTO> = {
    success: true,
    httpStatus: 200,
    data: {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      exp: payload.exp,
    } as AuthUserDTO,
    error: null,
  };

  return NextResponse.json(res, { status: 200 });
};
