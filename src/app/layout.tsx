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
    default: 'LookThisOne — Your link in bio, your identity',
    template: '%s · LookThisOne',
  },
  description: 'A link-in-bio tool built around your identity.',
  metadataBase: new URL('https://lookthis.one'),
  openGraph: {
    title: 'LookThisOne — Your link in bio, your identity',
    description: 'A link-in-bio tool built around your identity.',
    url: 'https://lookthis.one',
    siteName: 'LookThisOne',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LookThisOne — Your link in bio, your identity',
    description: 'A link-in-bio tool built around your identity.',
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
