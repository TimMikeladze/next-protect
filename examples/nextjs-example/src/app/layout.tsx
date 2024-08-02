import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
// Enable for SSR
// import { NextProtect } from 'next-protect/react';
// import { np } from './api/next-protect';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Enable for SSR */}
        {/* <NextProtect isProtected={await np.isProtected()}> */}
        {children}
        {/* </NextProtect> */}
      </body>
    </html>
  );
}