"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupRequestSchema, SignupRequest } from "@/app/_types/Signup";
import { TextInputField } from "@/app/_components/TextInputField";
import { ErrorMsgField } from "@/app/_components/ErrorMsgField";
import { Button } from "@/app/_components/Button";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/_hooks/useAuth";

const Page: React.FC = () => {
  const c_Email = "email";
  const c_Password = "password";
  const c_Name = "name";
  const [isSignUpCompleted, setIsSignUpCompleted] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const router = useRouter();

  const { signup } = useAuth();

  const form = useForm<SignupRequest>({
    mode: "onChange",
    resolver: zodResolver(signupRequestSchema),
  });
  const fieldErrors = form.formState.errors;

  const onSubmit = async (signupRequest: SignupRequest) => {
    try {
      const createdUser = await signup(signupRequest);
      console.log(createdUser);
      setIsSignUpCompleted(true);
      router.replace(`/login?${c_Email}=${signupRequest.email}`);
    } catch (error) {
      console.error("Error during signup:", error);
      setSignupError("サインアップに失敗");
    }
  };

  return (
    <main>
      <div className="text-2xl font-bold">Signup</div>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-y-4"
      >
        <div>
          <label htmlFor={c_Name} className="mb-2 block font-bold">
            名前
          </label>
          <TextInputField
            {...form.register(c_Name)}
            id={c_Name}
            placeholder="坂本 金八"
            type="text"
            disabled={form.formState.isSubmitting || isSignUpCompleted}
            error={!!fieldErrors.name}
            autoComplete="name"
          />
          <ErrorMsgField msg={fieldErrors.name?.message} />
        </div>

        <div>
          <label htmlFor={c_Email} className="mb-2 block font-bold">
            メールアドレス（ログインID）
          </label>
          <TextInputField
            {...form.register(c_Email)}
            id={c_Email}
            placeholder="name@example.com"
            type="email"
            disabled={form.formState.isSubmitting || isSignUpCompleted}
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
            {...form.register(c_Password)}
            id={c_Password}
            placeholder="********"
            type="password"
            disabled={form.formState.isSubmitting || isSignUpCompleted}
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
            !form.formState.isValid ||
            form.formState.isSubmitting ||
            isSignUpCompleted
          }
        >
          登録
        </Button>
      </form>

      {isSignUpCompleted && (
        <div className="mt-4">
          サインアップが完了しました。
          <NextLink href="/login" className="text-blue-500 underline">
            ログインページ
          </NextLink>
          からログインしてください。
        </div>
      )}

      {signupError && <div className="mt-4 text-red-500">{signupError}</div>}
    </main>
  );
};

export default Page;
