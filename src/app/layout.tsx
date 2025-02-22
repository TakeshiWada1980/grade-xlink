import type { Metadata } from "next";
import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import Header from "@/app/_components/Header";

export const metadata: Metadata = {
  title: "GradeXLink",
  description: "...",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  const { children } = props;
  const hoge = "";
  return (
    <html lang="ja">
      <body>
        <Header />
        <div className="mx-4 mt-2 max-w-3xl md:mx-auto">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
