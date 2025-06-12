import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from './ConvexClientProvider';
import Sidebar from '@/lib/components/navigation/Sidebar';
import { ClerkProvider } from '@clerk/nextjs';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aqutte Chat',
  description:
    'Get instant responses, help with tasks, and enjoy meaningful interactions.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aqchat.vercel.app',
    siteName: 'Aqutte Chat',
    title: 'Aqutte Chat',
    description:
      'Get instant responses, help with tasks, and enjoy meaningful interactions.',
    images: '/images/og.webp',
  },
};

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="hide-scrollbar">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden flex`}>
          <ConvexClientProvider>
            <Sidebar />
            <main className="flex flex-col">{children}</main>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
