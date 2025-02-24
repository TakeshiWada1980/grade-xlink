import type { AuthUser } from "@/app/_types/AuthUser";
import type { AuthUserDTO } from "@/app/_types/AuthUserDTO";

export class AuthUserConverter {
  static toEntity(dto: AuthUserDTO): AuthUser {
    return {
      ...dto,
      exp: dto.exp ? new Date(dto.exp * 1000) : undefined, // UNIXタイムスタンプをDateオブジェクトに変換
    };
  }

  static toDTO(entity: AuthUser): AuthUserDTO {
    return {
      ...entity,
      exp: entity.exp ? Math.floor(entity.exp.getTime() / 1000) : undefined, // DateオブジェクトをUNIXタイムスタンプに変換
    };
  }

  // バリデーション付きの変換メソッド
  static toEntityWithValidation(dto: AuthUserDTO): AuthUser {
    this.validateDTO(dto);
    return this.toEntity(dto);
  }

  private static validateDTO(dto: AuthUserDTO): void {
    if (!dto.userId) throw new Error("userId is required");
    if (!dto.email) throw new Error("email is required");
    if (!dto.name) throw new Error("name is required");
    if (!dto.role) throw new Error("role is required");
    if (dto.exp !== undefined && (isNaN(dto.exp) || dto.exp < 0)) {
      throw new Error("exp must be a valid positive number");
    }
  }
}
