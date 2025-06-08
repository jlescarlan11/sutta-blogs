"use client";
import { Box, Button, Container, Flex } from "@radix-ui/themes";
import classNames from "classnames";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { LuMenu, LuSearch, LuX } from "react-icons/lu";
import Logo from "./Logo";

interface NavLink {
  label: string;
  href: string;
}

const NavBar = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const links: NavLink[] =
    status === "authenticated"
      ? [
          { label: "Dashboard", href: "/" },
          { label: "My Blogs", href: "/blogs" },
          { label: "My Profile", href: "/profile" },
        ]
      : [{ label: "Dashboard", href: "/" }];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleMobileMenuToggle = (): void => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <Box className="sticky top-0 z-50 border-b border-[var(--purple-6)] bg-[var(--purple-1)] backdrop-blur-sm bg-opacity-90">
      <Container size="3" className="px-4 py-4 sm:px-6 lg:px-8">
        <Flex align="center" justify="between" gap="4">
          <Flex align="center" gap="4">
            <Link href="/" className="flex-shrink-0" aria-label="Home">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block" aria-label="Main navigation">
              <ul className="flex space-x-6">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={classNames(
                        "text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors",
                        "font-medium text-sm px-3 py-2 rounded-md",
                        {
                          "text-[var(--purple-12)] bg-[var(--purple-3)]": link.href === currentPath,
                        }
                      )}
                      aria-current={link.href === currentPath ? "page" : undefined}
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
            role="search"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[var(--purple-2)] border border-[var(--purple-6)] rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--purple-7)] focus:border-transparent transition-all"
                aria-label="Search blogs"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors p-1 rounded-md hover:bg-[var(--purple-3)]"
                aria-label="Submit search"
              >
                <LuSearch className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Desktop Logout/Login */}
          <div className="hidden md:block">
            {status === "authenticated" ? (
              <Button
                variant="ghost"
                className="btn btn-ghost justify-start h-11 w-full text-base hover:bg-[var(--purple-3)] transition-colors"
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Log out"
              >
                Log Out
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => signIn("google")}
                className="btn btn-primary h-11 px-6 text-base font-medium hover:bg-[var(--purple-4)] transition-colors"
                aria-label="Log in with Google"
              >
                Log in
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-[var(--purple-3)] transition-colors"
            onClick={handleMobileMenuToggle}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
          </button>
        </Flex>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <Box 
            className="md:hidden mt-4 pt-4 border-t border-[var(--purple-6)] animate-in slide-in-from-top-5 duration-200"
            role="dialog"
            aria-label="Mobile menu"
          >
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-[var(--purple-2)] border border-[var(--purple-6)] rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--purple-7)] focus:border-transparent"
                  aria-label="Search blogs"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors p-1 rounded-md hover:bg-[var(--purple-3)]"
                  aria-label="Submit search"
                >
                  <LuSearch className="w-5 h-5" />
                </button>
              </div>
            </form>

            <nav aria-label="Mobile navigation">
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={classNames(
                        "block text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors",
                        "font-medium text-sm px-3 py-2 rounded-md",
                        {
                          "text-[var(--purple-12)] bg-[var(--purple-3)]": link.href === currentPath,
                        }
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={link.href === currentPath ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  {status === "authenticated" ? (
                    <Button
                      className="w-full btn btn-ghost justify-start h-10 text-base hover:bg-[var(--purple-3)] transition-colors"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      role="menuitem"
                    >
                      Log Out
                    </Button>
                  ) : (
                    <Button
                      onClick={() => signIn("google")}
                      className="w-full btn btn-primary h-11 px-6 text-base font-medium hover:bg-[var(--purple-4)] transition-colors"
                      aria-label="Log in with Google"
                    >
                      Log in
                    </Button>
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
