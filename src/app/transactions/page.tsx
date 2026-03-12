import AllTransactionsPage from '@/components/pages/AllTransactionsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Transactions - Haram Packages',
  description: 'View all transactions',
};

export default function TransactionPageWrapper() {
  return <AllTransactionsPage />;
}
