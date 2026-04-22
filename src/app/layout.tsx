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
  title: {
    default: 'LookThisOne — Tu link en bio, con tu identidad',
    template: '%s · LookThisOne',
  },
  description: 'Herramienta de link en bio.',
  metadataBase: new URL('https://lookthis.one'),
  openGraph: {
    title: 'LookThisOne — Tu link en bio, con tu identidad',
    description: 'Herramienta de link en bio.',
    url: 'https://lookthis.one',
    siteName: 'LookThisOne',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LookThisOne — Tu link en bio, con tu identidad',
    description: 'Herramienta de link en bio.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
