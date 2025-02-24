// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload as JoseJWTPayload } from "jose";
import type { JWTPayload } from "@/app/_types/JWTPayload";

// JWT設定の型定義
interface JWTOptions {
  expiresIn: string; // "24h" や "7d" を設定
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class JWT {
  private static readonly SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET!
  );

  private static readonly DEFAULT_OPTIONS: JWTOptions = {
    expiresIn: "24h",
  };

  /**
   * JWTトークンを生成します
   * @param payload - トークンに含めるデータ（name を含む）
   * @param options - JWT生成オプション
   * @returns 生成されたJWTトークン
   */
  static async sign(
    payload: Omit<JWTPayload, "iat" | "exp">,
    options: Partial<JWTOptions> = {}
  ): Promise<string> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    try {
      const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(opts.expiresIn)
        .sign(this.SECRET);

      return token;
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthError(`Failed to sign JWT - ${error.message}`);
      }
      throw new AuthError("Failed to sign JWT");
    }
  }

  /**
   * JWTトークンを検証し、ペイロードを取得します
   * @param token - 検証するJWTトークン
   * @returns デコードされたペイロード
   * @throws AuthError トークンが無効な場合
   */
  static async verify(token: string): Promise<JWTPayload> {
    try {
      const { payload } = await jwtVerify(token, this.SECRET);

      // ペイロードの型チェックと変換
      const validatedPayload = this.validateAndTransformPayload(payload);

      return validatedPayload;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError("Invalid token");
    }
  }

  /**
   * JWTペイロードを検証し、適切な型に変換します
   * @param payload - 検証するペイロード
   * @returns 検証済みのJWTPayload
   * @throws AuthError ペイロードが無効な場合
   */
  private static validateAndTransformPayload(
    payload: JoseJWTPayload
  ): JWTPayload {
    if (!this.isValidPayload(payload)) {
      throw new AuthError("Invalid payload structure");
    }

    // 検証済みのペイロードを返す
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name, // 追加
      role: payload.role,
      iat: payload.iat,
      exp: payload.exp,
    };
  }

  /**
   * ペイロードが必要な属性と型を持っているか検証します
   * @param payload - 検証するペイロード
   * @returns ペイロードが有効な場合true
   */
  private static isValidPayload(
    payload: JoseJWTPayload
  ): payload is JoseJWTPayload & {
    userId: string;
    email: string;
    name: string; // 追加
    role: string;
  } {
    if (!payload || typeof payload !== "object") {
      return false;
    }

    return (
      "userId" in payload &&
      "email" in payload &&
      "name" in payload && // 追加
      "role" in payload &&
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.name === "string" && // 追加
      typeof payload.role === "string"
    );
  }
}

// 使用例
// export async function createAuthToken(user: User): Promise<string> {
//   return JWT.sign({
//     userId: user.id,
//     email: user.email,
//     role: user.role,
//   });
// }

// export async function validateAuthToken(token: string): Promise<JWTPayload> {
//   return JWT.verify(token);
// }
