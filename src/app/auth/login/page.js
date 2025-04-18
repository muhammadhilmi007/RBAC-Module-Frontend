// src/app/auth/login/page.js
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - RBAC Admin',
  description: 'Login to access RBAC Admin Dashboard',
};

export default function LoginPage() {
  return <LoginForm />;
}