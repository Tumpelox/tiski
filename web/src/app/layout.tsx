import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import * as React from 'react';
import NavigationMenuButton from '@/components/NavigationMenuButton';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tarratoimikunta',
  description: 'Tarratoimikunnan verkkosivut tarratilauksia varten',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-blue-30 to-blue-300 min-h-screen`}
      >
        <NavigationMenuButton>
          <nav className="bg-yellow-300">
            <ul>
              <li>
                <Link href={`/hallinta/tilaukset`}>Tilaukset</Link>
              </li>
              <li>
                <Link href={`/hallinta/koodit`}>Koodit</Link>
              </li>
              <li>
                <Link href={`/tuotteet`}>Tuotteet</Link>
              </li>
              <li>
                <Link href={`/tilaus`}>Tilaus</Link>
              </li>
              <li>
                <Link href={`/`}>Etusivu</Link>
              </li>
            </ul>
          </nav>
        </NavigationMenuButton>

        <main className="my-4">{children}</main>
      </body>
    </html>
  );
}
