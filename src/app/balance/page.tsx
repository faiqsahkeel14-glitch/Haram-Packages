import BalanceInquiryPage from '@/components/pages/BalanceInquiryPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Balance Inquiry - Haram Packages',
  description: 'Check customer and supplier balances',
};

export default function BalancePageWrapper() {
  return <BalanceInquiryPage />;
}
