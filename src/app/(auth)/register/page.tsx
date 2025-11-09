import { redirect } from 'next/navigation';

export default function RegisterPage() {
  // Registration disabled in production - users created by admin
  redirect('/login');
}
