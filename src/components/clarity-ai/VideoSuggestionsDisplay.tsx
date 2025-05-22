
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Search } from "lucide-react"; // Added Search icon

interface VideoSuggestionsDisplayProps {
  topic: string | null;
  language: "en" | "bn";
}

export function VideoSuggestionsDisplay({ topic, language }: VideoSuggestionsDisplayProps) {
  if (!topic) {
    return null; 
  }

  const constructYouTubeSearchUrl = () => {
    if (!topic) return "#";
    const encodedTopic = encodeURIComponent(topic);
    const langParam = language === "bn" ? "&hl=bn" : "&hl=en";
    return `https://www.youtube.com/results?search_query=${encodedTopic}${langParam}`;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Youtube className="mr-2 h-5 w-5 text-primary" />
          Explore Videos on YouTube
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">
          Looking for videos related to "{topic}"? Click the button below to search on YouTube.
        </p>
        <Button
          onClick={() => window.open(constructYouTubeSearchUrl(), "_blank")}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          Search for "{topic}" videos on YouTube
        </Button>
      </CardContent>
    </Card>
  );
}
