import Daybook from '@/components/pages/Daybook';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daybook - Haram Packages',
  description: 'Daily transaction daybook',
};

export default function DaybookPage() {
  return <Daybook />;
}
