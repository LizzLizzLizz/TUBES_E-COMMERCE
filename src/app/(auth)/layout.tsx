import type { Metadata } from "next";
import './auth.css';

export const metadata: Metadata = {
  title: "PERON.ID - Login & Register",
  description: "Sign in or create an account",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="auth-layout">{children}</div>;
}
