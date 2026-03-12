import Dashboard from '@/components/Dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Haram Packages',
  description: 'Admin dashboard for Haram Packages',
};

export default function DashboardPage() {
  return <Dashboard />;
}
