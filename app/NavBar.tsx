import Link from "next/link";
import React from "react";
import Logo from "./Logo";
import { Flex } from "@radix-ui/themes";

const NavBar = () => {
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "My Blogs", href: "/blogs" },
  ];

  return (
    <Flex className="space-x-4 border-b mb-4 px-4 h-14 items-center text-[var(--plum-12)]">
      <Link href="/" className="flex items-center">
        <Logo />
        Blog It
      </Link>
      <ul className="flex space-x-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[var(--plum-11)] hover:text-[var(--plum-12)] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Flex>
  );
};

export default NavBar;
