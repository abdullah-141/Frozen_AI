
"use client";

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
// Removed LanguageToggle import
import { Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showBackToEducationSelection = pathname !== '/education';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" suppressHydrationWarning>
      <header className="py-4 px-4 sm:px-6 md:px-8 border-b border-border shadow-sm sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/" passHref>
              <Button variant="outline" size="icon" aria-label="Back to Main Homepage">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            {showBackToEducationSelection && (
                <Link href="/education" passHref>
                    <Button variant="outline" size="sm" aria-label="Back to Education Level Selection">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Education Levels
                    </Button>
                </Link>
            )}
             <div className="flex items-center space-x-2">
                <Zap className="h-7 w-7 text-primary" />
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Educational Resources
                </h1>
              </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Removed LanguageToggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-grow w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-12">
        <p>Frozen Voltage - Education Portal</p>
      </footer>
    </div>
  );
}
