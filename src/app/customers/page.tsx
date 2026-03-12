import CustomersPage from '@/components/pages/CustomersPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers - Haram Packages',
  description: 'Manage customers and suppliers',
};

export default function CustomerPageWrapper() {
  return <CustomersPage />;
}
