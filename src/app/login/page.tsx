"use client";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequest, loginRequestSchema } from "@/app/_types/Login";
import { TextInputField } from "@/app/_components/TextInputField";
import { ErrorMsgField } from "@/app/_components/ErrorMsgField";
import { Button } from "@/app/_components/Button";
import { useAuth } from "@/app/_hooks/useAuth";
import { redirect } from "next/navigation";
import NextLink from "next/link";

const Page: React.FC = () => {
  const c_Email = "email";
  const c_Password = "password";

  const { login, authUser } = useAuth();

  const formMethods = useForm<LoginRequest>({
    mode: "onChange",
    resolver: zodResolver(loginRequestSchema),
  });
  const fieldErrors = formMethods.formState.errors;
  const setFromValue = formMethods.setValue;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get(c_Email);
    setFromValue(c_Email, email || "");
  }, [setFromValue]);

  const onSubmit = async (formValues: LoginRequest) => {
    try {
      const result = await login(formValues);
      console.log("ログイン成功:", result);
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  if (authUser) {
    redirect("/dashboard");
  }

  return (
    <main>
      <div className="text-2xl font-bold">Login</div>
      <form
        noValidate
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-y-4"
      >
        <div>
          <label htmlFor={c_Email} className="mb-2 block font-bold">
            メールアドレス（ログインID）
          </label>
          <TextInputField
            {...formMethods.register(c_Email)}
            id={c_Email}
            placeholder="name@example.com"
            type="email"
            disabled={formMethods.formState.isSubmitting}
            error={!!fieldErrors.email}
            autoComplete="email"
          />
          <ErrorMsgField msg={fieldErrors.email?.message} />
        </div>

        <div>
          <label htmlFor={c_Password} className="mb-2 block font-bold">
            パスワード
          </label>
          <TextInputField
            {...formMethods.register(c_Password)}
            id={c_Password}
            placeholder="********"
            type="password"
            disabled={formMethods.formState.isSubmitting}
            error={!!fieldErrors.password}
            autoComplete="off"
          />
          <ErrorMsgField msg={fieldErrors.password?.message} />
        </div>

        <Button
          variant="indigo"
          width="stretch"
          className="tracking-widest"
          disabled={
            !formMethods.formState.isValid || formMethods.formState.isSubmitting
          }
        >
          ログイン
        </Button>
      </form>

      <NextLink href="/dashboard" className="text-blue-500 underline">
        ダッシュボードへ
      </NextLink>
    </main>
  );
};

export default Page;
