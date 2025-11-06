import Link from 'next/link';
import { useTheme } from '../lib/ThemeContext';

export default function PublicNav() {
  const { theme } = useTheme();
  return (
    <nav
      className="w-full shadow-lg"
      style={{ backgroundColor: theme.colors.surface }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl"
            style={{ backgroundColor: theme.colors.primary, color: '#fff' }}
          >
            S
          </div>
          <span className="font-bold text-lg" style={{ color: theme.colors.primary }}>
            School CMS
          </span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="hover:underline font-medium" style={{ color: theme.colors.text }}>
            Home
          </Link>
          <Link href="/about" className="hover:underline font-medium" style={{ color: theme.colors.text }}>
            About
          </Link>
          <Link href="/posts" className="hover:underline font-medium" style={{ color: theme.colors.text }}>
            News & Posts
          </Link>
          <Link href="/contact" className="hover:underline font-medium" style={{ color: theme.colors.text }}>
            Contact
          </Link>
          <Link href="/admin" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
            Admin
          </Link>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden">
          {/* TODO: Add mobile menu toggle */}
        </div>
      </div>
    </nav>
  );
}
