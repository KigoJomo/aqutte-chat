import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/lib/components/navigation/Sidebar';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from './ConvexClientProvider';
import { cn } from '@/lib/utils/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aqutte-chat.vercel.app/'),
  title: 'Aqutte Chat',
  description:
    'Get instant responses, help with tasks, and enjoy meaningful interactions.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aqutte-chat.vercel.app/',
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
    <html lang="en" className="hide-scrollbar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden flex`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <Sidebar />
            <main className="flex flex-col">
              <section
                className={cn(
                  'min-h-screen overflow-y-auto hide-scrollbar',
                  'flex flex-col items-center !pb-0 relative'
                )}>
                {children}
                
              </section>
            </main>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
