import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Haram Packages',
  description: 'Complete package management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
