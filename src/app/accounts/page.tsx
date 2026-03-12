import AccountsPage from '@/components/pages/AccountsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounts - Haram Packages',
  description: 'Manage bank and cash accounts',
};

export default function AccountPageWrapper() {
  return <AccountsPage />;
}
