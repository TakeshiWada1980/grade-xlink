import type { Metadata } from "next";
import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { AuthProviderLayer } from "@/app/_components/AuthProviderLayer";

export const metadata: Metadata = {
  title: "GradeXLink",
  description: "...",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <html lang="ja">
      <body>
        <AuthProviderLayer>{children}</AuthProviderLayer>
      </body>
    </html>
  );
};

export default RootLayout;
