"use client";

import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardUser } from "@fortawesome/free-solid-svg-icons";
import NextLink from "next/link";
import { useAuth } from "@/app/_hooks/useAuth";

const Header: React.FC = () => {
  const { authUser, logout } = useAuth();

  return (
    <header>
      <div className="bg-slate-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-3xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white"
          )}
        >
          <div>
            <NextLink href="/">
              <FontAwesomeIcon icon={faChalkboardUser} className="mr-1.5" />
              GradeXLink
            </NextLink>
          </div>
          {authUser && <div>{authUser.name}</div>}

          <div>About</div>
          <button onClick={async () => await logout()}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
