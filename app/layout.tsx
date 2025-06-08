import { Container, Flex, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { Inter, Lora, Mansalva } from "next/font/google";
import AuthProvider from "./auth/Provider";
import "./globals.css";
import NavBar from "./NavBar";
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

export const metadata: Metadata = {
  title: "Sutta Blogs",
  description: "A platform for sharing and discovering Buddhist teachings",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mansalva.variable} ${lora.variable}`}
    >
      <body className="antialiased min-h-dvh bg-[var(--purple-1)] text-[var(--purple-11)]">
        <AuthProvider>
          <Theme accentColor="purple">
            <Flex
              direction="column"
              className="min-h-dvh text-[var(--purple-12)]"
            >
              <NavBar />
              <main className="flex-1">
                <Container size="3" className="py-8 px-4 sm:px-6 lg:px-8">
                  {children}
                </Container>
              </main>
            </Flex>
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
