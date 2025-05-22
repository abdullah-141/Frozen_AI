
"use client";

import { PackageOpen, YoutubeIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MoreToComePage() {
  const videoId = "4tal8dd7PVU"; // Extracted from https://www.youtube.com/watch?v=4tal8dd7PVU

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
      <PackageOpen className="h-24 w-24 text-primary opacity-80" />
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        More to Come!
      </h1>
      <p className="text-xl text-muted-foreground max-w-md">
        We're working hard to bring you exciting new features and content. 
        Stay tuned for updates!
      </p>

      <Card className="w-full max-w-2xl mt-8 shadow-lg"> {/* Changed max-w-lg to max-w-2xl */}
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <YoutubeIcon className="mr-2 h-6 w-6 text-red-600" />
            Sneak Peek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="hover:no-underline text-left text-muted-foreground p-4">
                <span className="flex-grow pr-2 text-base"> {/* Added text-base for larger font */}
                  🌐 We're building a future where users can interact with our site through external devices — opening powerful new possibilities for blind users 🦯 and making our platform more inclusive than ever 🤝✨
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg border shadow-md">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?si=someRandomStringForBetterTracking`}
                    title="YouTube video player - Sneak Peek"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
