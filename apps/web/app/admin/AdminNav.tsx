'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/places', label: 'Places' },
    { href: '/admin/journeys', label: 'Journeys' },
    { href: '/admin/questions', label: 'Questions' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/settings', label: 'Settings' },
  ];
  
  return (
    <div className="flex space-x-8">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
            pathname === item.href
              ? 'border-primary-500 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}