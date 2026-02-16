import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - Maleosan Travel',
  description: 'Admin login page for Maleosan Travel',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
