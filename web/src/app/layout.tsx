import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import * as React from 'react';
import NavigationMenuButton from '@/components/NavigationMenuButton';
import NavigationMenu from '@/components/NavigationMenu';
import { listDocumentsWithApi } from '@/services/databases';
import { Settings, SettingsDatabase } from '@/interfaces/settings.interface';
import ToastMessage from '@/components/ToastMessage';
import SignOutButton from '@/components/SignOutButton';
import { getLoggedInUser } from '@/services/userSession';

const montserrat = Montserrat({
  variable: '--font-montserrat',
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

  const user = await getLoggedInUser();

  const menuItems = settings.data?.[0].mainMenu.menuItems ?? [];

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${montserrat.variable} antialiased bg-gradient-to-b from-white to-blue-300 min-h-screen`}
      >
        <header className="w-full min-h-16 md:h-fit px-4 sm:px-8 md:px-0 md:container md:mx-auto md:max-w-3xl">
          <ToastMessage />
          <NavigationMenuButton>
            <NavigationMenu menuItems={menuItems} />
            <SignOutButton user={user} />
          </NavigationMenuButton>
        </header>
        <main className="container max-w-3xl mx-auto px-4 sm:px-8 md:px-0">
          {children}
        </main>
      </body>
    </html>
  );
}
