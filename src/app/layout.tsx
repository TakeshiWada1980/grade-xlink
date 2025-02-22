import type { Metadata } from "next";
import "./globals.css";

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
        <header>
          <div className="bg-slate-800 py-2 font-bold text-white">Header</div>
        </header>
        <div>{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
