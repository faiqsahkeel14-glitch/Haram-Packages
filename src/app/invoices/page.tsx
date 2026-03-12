import InvoicesPage from '@/components/pages/InvoicesPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices - Haram Packages',
  description: 'Manage invoices and billing',
};

export default function InvoicePageWrapper() {
  return <InvoicesPage />;
}
