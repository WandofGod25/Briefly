import { ClerkProvider } from '@clerk/nextjs';
import { Inter as FontSans } from 'next/font/google'; 
import './globals.css';
import Navigation from '@/components/ui/Navigation';
import { cn } from '@/lib/utils';

const fontSans = FontSans({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Briefly - Voice & Text Reporting Assistant',
  description: 'Transform unstructured employee updates into structured weekly reports and tasks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
          <meta httpEquiv="Pragma" content="no-cache" />
          <meta httpEquiv="Expires" content="0" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1 animate-fade-in">
              {children}
            </main>
            <footer className="py-6 md:px-8 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm text-muted-foreground md:text-left">
                  &copy; {new Date().getFullYear()} Briefly. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
