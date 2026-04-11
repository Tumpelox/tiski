import type { Metadata } from 'next';
import './globals.css';
import * as React from 'react';
import NavigationMenuButton from '@/components/NavigationMenuButton';
import NavigationMenu from '@/components/NavigationMenu';
import { listDocumentsWithApi } from '@/services/databases';
import { Settings, SettingsDatabase } from '@/interfaces/settings.interface';
import ToastMessage from '@/components/ToastMessage';
import SignOutButton from '@/components/SignOutButton';
import { getLoggedInUser } from '@/services/userSession';
import PlausibleProvider from 'next-plausible';

export const metadata: Metadata = {
  title: 'Tarratoimikunta',
  description: 'Tarratoimikunta harjoittaa pehmeää aktivismia suviseuroissa',
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

  const { user } = await getLoggedInUser();

  const menuItems = settings.data?.[0].mainMenu.menuItems ?? [];

  return (
    <PlausibleProvider domain="tarratoimikunta.fi">
      <html lang="fi">
        <head>
          <meta name="theme-color" content="#ffffff" />
        </head>
        <body
          className={`antialiased bg-background min-h-dvh flex flex-col md:gap-6 gradient bg-fixed`}
        >
          <header className="w-full min-h-16 md:h-fit px-4 sm:px-8 md:px-0 md:container md:mx-auto md:max-w-3xl">
            <ToastMessage />
            <NavigationMenuButton>
              <NavigationMenu items={menuItems}>
                <SignOutButton user={user} />
              </NavigationMenu>
            </NavigationMenuButton>
          </header>
          <main className="grow flex flex-col pb-8 pt-4">{children}</main>
        </body>
      </html>
    </PlausibleProvider>
  );
}
