import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Shortlist AI",
  description: "HR login for Shortlist AI dashboard",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 