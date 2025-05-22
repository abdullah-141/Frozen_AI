
"use client";

import Link from 'next/link';
import { Zap, BrainCircuit, Lightbulb, Users, BarChartBig, BookOpenCheck, Film, Beaker, FileText, Accessibility, PackageOpen } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { BackgroundLines } from '@/components/ui/background-lines';

export default function HomePage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative" suppressHydrationWarning>
      <BackgroundLines lineColorLight="rgba(0,0,0,0.06)" lineColorDark="rgba(255,255,255,0.04)" />
      <header className="py-6 px-4 sm:px-6 md:px-8 border-b border-border shadow-sm z-10 relative bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Zap className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Frozen Voltage
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow z-10 relative">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-normal text-foreground mb-6">
              Welcome to <span id="interactive-hero-title" className="text-primary">Frozen Voltage</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Unlocking insights and simplifying complexity with the power of AI. Explore our tools and discover a new way to learn and create.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
              <Link href="/ai-tool" passHref>
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 transition-shadow w-full sm:w-auto">
                  <BrainCircuit className="mr-3 h-6 w-6" />
                  Explore Frozen Voltage AI
                </Button>
              </Link>
              <Link href="/education" passHref>
                 <Button size="lg" className="text-lg px-8 py-6 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 transition-shadow w-full sm:w-auto">
                  <BookOpenCheck className="mr-3 h-6 w-6" />
                  Educational Resources
                </Button>
              </Link>
              <Link href="/scitales" passHref>
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 transition-shadow w-full sm:w-auto">
                  <Film className="mr-3 h-6 w-6" />
                  SciTales: Story-Based Learning
                </Button>
              </Link>
              <Link href="/virtual-lab" passHref>
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 transition-shadow w-full sm:w-auto">
                  <Beaker className="mr-3 h-6 w-6" />
                  Virtual Lab
                </Button>
              </Link>
              <Link href="/circular-zone" passHref>
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 transition-shadow w-full sm:w-auto">
                  <FileText className="mr-3 h-6 w-6" />
                  Circular Zone
                </Button>
              </Link>
              <Link href="/special" passHref>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/30 transition-shadow w-full sm:w-auto"
                >
                  <Accessibility className="mr-3 h-6 w-6" />
                  Specials 🙌
                </Button>
              </Link>
              <Link href="/more-to-come" passHref>
                <div className="p-[2px] rounded-md bg-gradient-to-r from-green-400 via-yellow-400 to-lime-500 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-card text-card-foreground hover:bg-muted/50 border-none w-full"
                  >
                    <PackageOpen className="mr-3 h-6 w-6" />
                    More to Come
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-transparent">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            <h3 className="text-3xl font-bold text-center text-foreground mb-16">What We Offer</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-card/80 backdrop-blur-sm">
                <CardHeader className="items-center text-center pt-8">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                    <Lightbulb className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">AI-Powered Explanations</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <p className="text-muted-foreground px-2">
                    Get complex topics broken down into simple, easy-to-understand explanations with our advanced AI tool.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-card/80 backdrop-blur-sm">
                <CardHeader className="items-center text-center pt-8">
                   <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                    <BarChartBig className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Visual Diagrams</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <p className="text-muted-foreground px-2">
                    Visualize concepts with automatically generated Mermaid diagrams, making learning more intuitive.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-card/80 backdrop-blur-sm">
                <CardHeader className="items-center text-center pt-8">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Interactive Learning Modules</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <p className="text-muted-foreground px-2">
                    Engage with tailored educational content, solve problems, take quizzes, and explore animated stories.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-card/80 backdrop-blur-sm">
                <CardHeader className="items-center text-center pt-8">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                    <Beaker className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Virtual Lab</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <p className="text-muted-foreground px-2">
                    Access and view key science lab manuals directly on our site.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-card/80 backdrop-blur-sm"> 
                <CardHeader className="items-center text-center pt-8">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                    <FileText className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Circular Zone</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <p className="text-muted-foreground px-2">
                    Find admission circulars from various universities in one convenient place.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-card/80 backdrop-blur-sm"> 
                <CardHeader className="items-center text-center pt-8">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                    <Accessibility className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Truly Special 😊</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <p className="text-muted-foreground px-2">
                    Dedicated features and tools designed for users with disabilities, promoting inclusivity.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl bg-card/80 backdrop-blur-sm"> 
                <CardHeader className="items-center text-center pt-8">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 inline-block">
                    <PackageOpen className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">More to Come!</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <p className="text-muted-foreground px-2">
                    Stay tuned for exciting new features and content updates!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-auto z-10 relative bg-background/80 backdrop-blur-sm">
        <p>Developed by Team Frozen Voltage. Copyright © {currentYear !== null ? currentYear : '...'}.</p>
      </footer>
    </div>
  );
}
    

    

    