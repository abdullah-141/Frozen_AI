
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertTriangle, Search, Youtube } from "lucide-react";
import { VideoAccordionDisplay } from "@/components/scitales/VideoAccordionDisplay";
import { findAnimatedYoutubeVideos, type FindAnimatedYoutubeVideosInput, type FindAnimatedYoutubeVideosOutput } from "@/ai/flows/find-animated-youtube-videos";
import { useToast } from "@/hooks/use-toast";
// Removed useLanguage import

export default function SciTalesAnimatedVideosPage() {
  const [topic, setTopic] = useState("");
  const language: "en" | "bn" = "en"; // Default language for this page
  const [suggestedVideos, setSuggestedVideos] = useState<FindAnimatedYoutubeVideosOutput['videos'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topicSearched, setTopicSearched] = useState<string | null>(null); 
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to find animated videos.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestedVideos(null);
    setTopicSearched(topic);

    try {
      const input: FindAnimatedYoutubeVideosInput = { topic, language };
      const result = await findAnimatedYoutubeVideos(input);
      
      if (result && result.videos && result.videos.length > 0) {
        setSuggestedVideos(result.videos);
      } else {
        setSuggestedVideos(null); 
      }
    } catch (e: any) {
      console.error("Error fetching videos:", e);
      let displayError = `Failed to fetch videos: ${e.message || "Please try again."}`;
      if (e.message && (e.message.includes("YouTube API Key is not configured") || e.message.toLowerCase().includes("api key not valid"))) {
        displayError = "Failed to fetch videos. There might be an issue with the YouTube API configuration. Please ensure the API key is correct and the YouTube Data API v3 is enabled in your Google Cloud project.";
      }
      setError(displayError);
      setSuggestedVideos(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center">
          <Youtube className="mr-3 h-8 w-8 text-primary" />
          Animated Video Learning
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore topics through engaging animated videos from YouTube.
        </p>
      </div>

      <Card className="w-full max-w-xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Find Animated Educational Videos</CardTitle>
          <CardDescription>Enter a topic. Videos will be searched in English.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic-input">Topic (e.g., "Solar Panel", "Photosynthesis")</Label>
            <Input
              id="topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic here..."
              disabled={isLoading}
              className="mt-1"
            />
          </div>
          {error && (
            <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">
              <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <Button onClick={handleSearch} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching Videos...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Videos
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <VideoAccordionDisplay videos={suggestedVideos} isLoading={isLoading} topicSearched={topicSearched} />

    </div>
  );
}
