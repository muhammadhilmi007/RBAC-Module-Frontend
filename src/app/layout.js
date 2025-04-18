// src/app/layout.js
import '@/styles/global.css';
import { Inter } from 'next/font/google';
import AppProviders from '@/providers/AppProviders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RBAC-ACL Application',
  description: 'Role-Based Access Control & Access Control List Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </AppProviders>
      </body>
    </html>
  );
}