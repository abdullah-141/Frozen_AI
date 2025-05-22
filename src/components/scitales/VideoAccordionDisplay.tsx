
"use client";

import type { FindAnimatedYoutubeVideosOutput } from "@/ai/flows/find-animated-youtube-videos";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Youtube, Film } from "lucide-react";

interface VideoAccordionDisplayProps {
  videos: FindAnimatedYoutubeVideosOutput['videos'] | null;
  isLoading: boolean;
  topicSearched: string | null;
}

export function VideoAccordionDisplay({ videos, isLoading, topicSearched }: VideoAccordionDisplayProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Film className="mr-2 h-6 w-6 text-primary" />
            Fetching Animated Videos...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <Skeleton className="h-8 w-3/4 mb-2" /> {/* Title */}
              <Skeleton className="h-20 w-full" /> {/* Description/Placeholder */}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!videos && topicSearched) {
     return (
      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Film className="mr-2 h-6 w-6 text-primary" />
            Animated Videos for "{topicSearched}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No animated videos found for this topic. Try a different search term.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!videos || videos.length === 0) {
    return null; // Don't show anything if no videos and no topic searched yet, or if videos is explicitly empty.
  }


  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Film className="mr-2 h-6 w-6 text-primary" />
          Animated Videos for "{topicSearched}"
        </CardTitle>
        <CardDescription>Click on a title to watch the video.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {videos.map((video, index) => (
            <AccordionItem value={`item-${index}`} key={video.id || index} className="border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
              <AccordionTrigger className="p-4 hover:bg-muted/50 w-full text-left">
                <div className="flex items-start space-x-3">
                  {video.thumbnailUrl && (
                    <div className="flex-shrink-0">
                      <Image
                        src={video.thumbnailUrl}
                        alt={`Thumbnail for ${video.title}`}
                        width={120}
                        height={90}
                        className="rounded object-cover"
                        unoptimized={video.thumbnailUrl.startsWith('https://placehold.co')}
                        data-ai-hint="video thumbnail"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h4 className="font-semibold text-base text-foreground">{video.title}</h4>
                    {video.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{video.description}</p>}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0 border-t bg-muted/20">
                {video.id ? (
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-b-md"
                    ></iframe>
                  </div>
                ) : (
                  <p className="p-4 text-center text-destructive">Video ID missing, cannot embed player.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
