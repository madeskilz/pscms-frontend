import Link from 'next/link';
import { useTheme } from '../lib/ThemeContext';

export default function PublicFooter() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="py-12 mt-16"
      style={{ 
        backgroundColor: theme.colors.surface,
        borderTop: `3px solid ${theme.colors.primary}`
      }}
    >
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* School Info */}
          <div>
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <p className="text-sm mb-4" style={{ color: theme.colors.textLight }}>
              Empowering Nigerian K12 students with quality education and innovative learning experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 
              className="font-bold text-lg mb-4"
              style={{ color: theme.colors.primary }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Admin', href: '/admin' }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:underline"
                    style={{ color: theme.colors.textLight }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 
              className="font-bold text-lg mb-4"
              style={{ color: theme.colors.primary }}
            >
              Resources
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Student Portal', href: '#' },
                { label: 'Parent Portal', href: '#' },
                { label: 'Staff Portal', href: '#' },
                { label: 'Library', href: '#' }
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm hover:underline"
                    style={{ color: theme.colors.textLight }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 
              className="font-bold text-lg mb-4"
              style={{ color: theme.colors.primary }}
            >
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: theme.colors.textLight }}>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@school.test" className="hover:underline">
                  info@school.test
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+234 (0) 123 456 7890</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="mt-12 pt-8 border-t text-center text-sm"
          style={{ 
            borderColor: theme.colors.accent,
            color: theme.colors.textLight 
          }}
        >
          <p>© {currentYear} K12 School CMS. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:underline">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
