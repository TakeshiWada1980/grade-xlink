"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/app/_contexts/AuthContext";
import Header from "@/app/_components/Header";

interface Props {
  children: ReactNode;
}

export const AuthProviderLayer: React.FC<Props> = (props) => {
  return (
    <>
      <AuthProvider>
        <AuthProvider>
          <Header />
          <main className="mx-4 mt-2 max-w-3xl md:mx-auto">
            {props.children}
          </main>
        </AuthProvider>
      </AuthProvider>
    </>
  );
};
