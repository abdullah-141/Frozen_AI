
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookText, Youtube, Lightbulb } from 'lucide-react';

export default function SciTalesSelectionPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <Lightbulb className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome to SciTales!
        </h1>
        <p className="text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
          Choose how you'd like to explore and learn complex topics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader className="items-center text-center">
            <BookText className="h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-2xl">Story-Based Explanation</CardTitle>
            <CardDescription className="text-base">
              Understand complex topics through simple and fun stories.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/scitales/story" passHref>
              <Button size="lg" className="w-full sm:w-auto">
                Learn with Stories
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
          <CardHeader className="items-center text-center">
            <Youtube className="h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-2xl">Animated Video Learning</CardTitle>
            <CardDescription className="text-base">
              Explore topics with engaging animated videos from YouTube.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/scitales/videos" passHref>
              <Button size="lg" className="w-full sm:w-auto">
                Watch Animated Videos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
