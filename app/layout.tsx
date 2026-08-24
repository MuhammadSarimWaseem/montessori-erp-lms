import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SKYELAX Montessori ERP & LMS | Modern Multi-Tenant Learning System',
  description: 'Enterprise Montessori ERP & Learning Management System featuring multi-tenant RBAC, offline-first PWA sync, AI Assistant (SkyeBot), and virtual Montessori manipulatives.',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Montessori PWA ServiceWorker registered with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Montessori PWA ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
