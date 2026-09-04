import { Link } from 'react-router-dom';
import { Instagram, Twitter, Github, Mail } from 'lucide-react';

const shopLinks = [
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Best Sellers', href: '/shop?sort=popular' },
  { label: 'Sale', href: '/sale' },
  { label: 'All Products', href: '/shop' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Press', href: '/press' },
  { label: 'Contact', href: '/contact' },
];

const supportLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'Order Status', href: '/orders' },
  { label: 'Returns', href: '/returns' },
  { label: 'Privacy Policy', href: '/privacy' },
];

const socialLinks = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Twitter', icon: Twitter, href: '#' },
  { label: 'GitHub', icon: Github, href: '#' },
  { label: 'Email', icon: Mail, href: '#' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-surface-800 bg-surface-950">
      <div className="container-app pt-16 pb-10">

        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-surface-950 font-black text-lg transition-transform duration-200 group-hover:scale-105">
                A
              </div>
              <span className="text-xl font-semibold tracking-widest text-white uppercase">The Aisle</span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed max-w-xs mb-6">
              A premium, modern e-commerce showcase platform built to demonstrate exceptional craftsmanship in full-stack development.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 bg-surface-900 border border-surface-800 hover:text-white hover:border-surface-700 hover:bg-surface-800 transition-all duration-150"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm text-surface-400 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm text-surface-400 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm text-surface-400 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">
            &copy; {new Date().getFullYear()} The Aisle. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-xs text-surface-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-surface-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
