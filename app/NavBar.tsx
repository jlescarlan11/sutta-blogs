"use client";
import { Box, Container, Flex } from "@radix-ui/themes";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { LuMenu, LuSearch, LuX } from "react-icons/lu";
import Logo from "./Logo";

const NavBar = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const links =
    status === "authenticated"
      ? [
          { label: "Dashboard", href: "/" },
          { label: "My Blogs", href: "/blogs" },
          { label: "My Profile", href: "/profile" },
        ]
      : [{ label: "Dashboard", href: "/" }];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box className="border-b border-[var(--purple-6)] bg-[var(--purple-1)]">
      <Container size="3" className="px-4 py-4 sm:px-6 lg:px-8">
        <Flex align="center" justify="between" gap="4">
          <Flex align="center" gap="4">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={classNames(
                        "text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors",
                        "font-medium text-sm",
                        {
                          "text-[var(--purple-12)]": link.href === currentPath,
                        }
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Flex>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="hidden md:block flex-1 max-w-md"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[var(--purple-2)] border border-[var(--purple-6)] rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--purple-7)] focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors"
              >
                <LuSearch className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Desktop Logout/Login */}
          <div className="hidden md:block">
            {status === "authenticated" ? (
              <Link
                href="/api/auth/signout"
                className="text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors font-medium text-sm"
              >
                Log Out
              </Link>
            ) : (
              <Link
                href="/api/auth/signin"
                className="text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors font-medium text-sm"
              >
                Log In
              </Link>
            )}
          </div>

          <div
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <LuX /> : <LuMenu />}
          </div>
        </Flex>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <Box className="md:hidden mt-4 pt-4 border-t border-[var(--purple-6)]">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-[var(--purple-2)] border border-[var(--purple-6)] rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--purple-7)] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors"
                >
                  <LuSearch className="w-5 h-5" />
                </button>
              </div>
            </form>

            <nav>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={classNames(
                        "block text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors",
                        "font-medium text-sm",
                        {
                          "text-[var(--purple-12)]": link.href === currentPath,
                        }
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  {status === "authenticated" ? (
                    <Link
                      href="/api/auth/signout"
                      className="block text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors font-medium text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log Out
                    </Link>
                  ) : (
                    <Link
                      href="/api/auth/signin"
                      className="block text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors font-medium text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NavBar;
