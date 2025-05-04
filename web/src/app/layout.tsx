import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import * as React from 'react';
import NavigationMenuButton from '@/components/NavigationMenuButton';
import ToastMessage, { NewToastMessage } from '@/components/ToastMessage';
import { isDevelopment } from '@/lib/utils';
import { listDocumentsWithApi } from '@/services/databases';
import { Settings, SettingsDatabase } from '@/interfaces/settings.interface';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await listDocumentsWithApi<Settings>(
    SettingsDatabase.DatabaseId,
    SettingsDatabase.CollectionId
  );

  const menuItems = settings.data?.[0].mainMenu.menuItems ?? [];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-blue-30 to-blue-300 min-h-screen`}
      >
        <ToastMessage />
        {
          isDevelopment && (
            <NewToastMessage />
          ) /* Jos devausympäristö niin näyttää viestin testauksen */
        }
        <NavigationMenuButton>
          <nav className="bg-yellow-300">
            <ul>
              {menuItems.map((item) => (
                <li key={item.$id}>
                  <Link href={item.url}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </NavigationMenuButton>

        <main className="my-4">{children}</main>
      </body>
    </html>
  );
}
