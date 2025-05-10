import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import * as React from 'react';
import NavigationMenuButton from '@/components/NavigationMenuButton';
import NavigationMenu from '@/components/NavigationMenu';
import { signOut } from '@/actions/auth';
import { Button } from '@/components/ui/button';
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
        className={`${montserrat.variable} ${montserrat.variable} antialiased bg-gradient-to-b from-blue-30 to-blue-300 min-h-screen`}
      >
        <header className="w-full h-16">
          <ToastMessage />
          <SignOutButton user={user} />
          <NavigationMenuButton>
            <NavigationMenu menuItems={menuItems} />
          </NavigationMenuButton>
        </header>
        <main className="container max-w-3xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
