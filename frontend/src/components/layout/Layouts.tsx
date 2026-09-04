import { type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

// Standard storefront layout with navbar, scrollable content, and footer
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-surface-950">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Clean layout for auth pages (no footer clutter)
export function AuthLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-surface-950">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20 flex items-center justify-center py-12">
        {children}
      </main>
    </div>
  );
}

// Full-bleed layout for pages needing edge-to-edge content
export function WideLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-surface-950">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
