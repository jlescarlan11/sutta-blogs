"use client";
import {
  Avatar,
  Box,
  Container,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuSearch } from "react-icons/lu";
import Logo from "./Logo";

const NavBar = () => {
  const currentPath = usePathname();
  const { status } = useSession();

  const links = [
    { label: "dashboard", href: "/" },
    { label: "my blogs", href: "/blogs" },
    { label: "my profile", href: "/profile" },
  ];

  return (
    <Box className="nav">
      <Container className="px-4 py-8">
        <Flex align="center">
          <Flex align="center" gap="4" flexGrow="1">
            <Box>
              <Link href="/">
                <Logo />
              </Link>
            </Box>
            <Box>
              <ul className="flex space-x-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={classNames({
                        "text-[var(--plum-11)]": link.href !== currentPath,
                        "hover:text-[var(--plum-12)] transition-colors": true,
                      })}
                    >
                      <Text>{link.label}</Text>
                    </Link>
                  </li>
                ))}
              </ul>
              <Box>
                {status === "authenticated" && (
                  <Link href="api/auth/signout">Log Out</Link>
                )}
                {status === "unauthenticated" && (
                  <Link href="api/auth/signin">Log In</Link>
                )}
              </Box>
            </Box>
          </Flex>
          <Flex align="center" gap="4">
            <TextField.Root placeholder="Search…" variant="soft" size="3">
              <TextField.Slot>
                <LuSearch />
              </TextField.Slot>
            </TextField.Root>

            <Box>
              <Avatar fallback="B" radius="full" />
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default NavBar;
