import { Container, Flex, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import type { Metadata, Viewport } from "next";
import { Inter, Lora, Mansalva } from "next/font/google";
import { FC, ReactNode } from "react";
import AuthProvider from "./auth/Provider";
import "./globals.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "./theme-config.css";

// Configure Inter as default font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const mansalva = Mansalva({
  subsets: ["latin"],
  variable: "--font-mansalva",
  weight: ["400"],
  display: "swap",
  preload: true,
});

// Configure Lora for headings
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Blog it",
  description: "A platform for sharing and discovering thought and ideas",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  verification: {
    google: "Z22mijyAZckzLjEbp3X1k45Jbxn5QcxI1omoPIyi7fA",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mansalva.variable} ${lora.variable}`}
    >
      <body className="antialiased min-h-dvh bg-[var(--purple-1)] text-[var(--purple-11)]">
        <AuthProvider>
          <Theme accentColor="purple" scaling="100%">
            <Flex
              direction="column"
              className="min-h-dvh text-[var(--purple-12)]"
            >
              <NavBar />
              <main className="flex-1 w-full">
                <Container
                  size="3"
                  className="py-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl"
                >
                  {children}
                </Container>
              </main>
              <Footer />
            </Flex>
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
