"use client";
import { Flex } from "@radix-ui/themes";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const NavBar = () => {
  const currentPath = usePathname();
  console.log(currentPath);

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
              className={classNames({
                "text-[var(--plum-12)]": link.href === currentPath,
                "text-[var(--plum-11)]": link.href !== currentPath,
                "hover:text-[var(--plum-12)] transition-colors": true,
              })}
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
