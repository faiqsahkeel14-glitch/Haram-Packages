import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'Haram Packages - Accounting System',
  description: 'Complete accounting and invoicing system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
