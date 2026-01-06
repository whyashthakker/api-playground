'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '🧱 Lego Collection', description: 'Basic CRUD operations' },
    { href: '/restaurant', label: '🍽️ Restaurant', description: 'API as a waiter concept' },
    { href: '/database', label: '🗄️ Database', description: 'Learn SQL interactively' },
    { href: '/docs', label: '📚 Docs', description: 'Learn about REST APIs' }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-black">API Playground</h1>
            <p className="text-sm text-black">Learn APIs with fun examples!</p>
          </div>
          
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'text-black hover:text-black hover:bg-gray-50'
                }`}
              >
                <span className="font-semibold text-sm">{item.label}</span>
                <span className="text-xs mt-1">{item.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}