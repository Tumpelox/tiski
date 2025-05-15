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
    <html lang="fi">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${montserrat.variable} ${montserrat.variable} antialiased bg-gradient-to-b from-foreground to-background min-h-dvh flex flex-col gap-4 md:gap-6`}
      >
        <header className="w-full min-h-16 md:h-fit px-4 sm:px-8 md:px-0 md:container md:mx-auto md:max-w-3xl">
          <ToastMessage />
          <NavigationMenuButton>
            <NavigationMenu items={menuItems}>
              <SignOutButton user={user} />
            </NavigationMenu>
          </NavigationMenuButton>
        </header>
        <main className="container max-w-3xl mx-auto px-4 sm:px-8 md:px-0 grow flex flex-col pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
