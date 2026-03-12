import LoginForm from '@/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Haram Packages',
  description: 'Admin login for Haram Packages',
};

export default function LoginPage() {
  return <LoginForm />;
}
