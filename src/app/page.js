// src/app/page.js
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect langsung ke halaman login ketika mengakses root path
  redirect('/auth/login');
}