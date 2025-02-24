import React, { createContext, useMemo, useCallback } from "react";
import type { LoginRequest } from "@/app/_types/Login";
import type { SignupRequest } from "@/app/_types/Signup";
import type { AuthUser } from "@/app/_types/AuthUser";
import type { AuthUserDTO } from "@/app/_types/AuthUserDTO";

import { useGetRequest } from "@/app/_hooks/useGetRequest";
import { logoutAction } from "@/app/_actions/logout";
import { loginAction } from "@/app/_actions/login";
import { signupAction } from "@/app/_actions/signup";
import { redirectAction } from "@/app/_actions/redirect";
import { revalidateAction } from "../_actions/revalidate";

import { useRouter } from "next/navigation";

type AuthContextType = {
  authUser: AuthUser | null | undefined;
  logout: () => Promise<void>;
  login: (loginRequest: LoginRequest) => Promise<AuthUser>;
  signup: (signupRequest: SignupRequest) => Promise<AuthUser>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode;
}

// AuthUserDTO を AuthUser に変換
const toEntity = (dto: AuthUserDTO): AuthUser => {
  return {
    ...dto,
    exp: dto.exp ? new Date(dto.exp * 1000) : undefined,
  };
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const endpoint = "/api/auth/me";
  const { data: response, mutate } = useGetRequest<AuthUserDTO>(endpoint);
  const router = useRouter();

  const logout = useCallback(async () => {
    await logoutAction();
    await mutate();
    await revalidateAction("/");
  }, [mutate]);

  const login = useCallback(
    async (loginRequest: LoginRequest) => {
      const authUser = await loginAction(loginRequest);
      await mutate();
      await redirectAction("/dashboard");
      return authUser;
    },
    [mutate]
  );

  const signup = useCallback(async (signupRequest: SignupRequest) => {
    const authUser = await signupAction(signupRequest);
    return authUser;
  }, []);

  const authUser = useMemo((): AuthUser | null | undefined => {
    if (!response) return undefined;
    return response.data === null ? null : toEntity(response.data);
  }, [response]);

  return (
    <AuthContext.Provider value={{ authUser, logout, login, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
