
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertTriangle, BookText, Sparkles } from "lucide-react";
import { generateLearningStory, type GenerateLearningStoryInput, type GenerateLearningStoryOutput } from "@/ai/flows/generate-learning-story";
import { useToast } from "@/hooks/use-toast";

export default function SciTalesStoryPage() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [story, setStory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateStory = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate a story.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setStory(null);

    try {
      const input: GenerateLearningStoryInput = { topic, language };
      const result = await generateLearningStory(input);
      
      if (result && result.storyText) {
        setStory(result.storyText);
      } else {
        setError("The AI failed to generate a story for this topic. Please try again or use a different topic.");
        setStory(null); 
      }
    } catch (e: any) {
      console.error("Error generating story:", e);
      let displayError = `Failed to generate story: ${e.message || "Please try again."}`;
       if (e.message && (e.message.includes("503") || e.message.toLowerCase().includes("overloaded") || e.message.toLowerCase().includes("service unavailable"))) {
        displayError = "The AI model is currently experiencing high demand or is temporarily unavailable. Please try again in a few moments.";
      }
      setError(displayError);
      setStory(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center">
          <BookText className="mr-3 h-8 w-8 text-primary" />
          Story-Based Explanation
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Enter a complex topic and get a simple, fun story to understand it!
        </p>
      </div>

      <Card className="w-full max-w-xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Generate a Learning Story</CardTitle>
          <CardDescription>What topic do you want to understand through a story? Select your preferred language for the story.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic-input">Topic (e.g., "Black Hole", "Quantum Entanglement")</Label>
            <Input
              id="topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter complex topic here..."
              disabled={isLoading}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="language-select">Story Language</Label>
            <Select
              value={language}
              onValueChange={(value: "en" | "bn") => setLanguage(value)}
              disabled={isLoading}
            >
              <SelectTrigger id="language-select" className="w-full mt-1">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && (
            <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">
              <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <Button onClick={handleGenerateStory} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Story...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Story
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {isLoading && !story && (
        <Card className="w-full max-w-xl mx-auto shadow-lg mt-8">
            <CardHeader>
                <CardTitle>Your Story is Brewing...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
            </CardContent>
        </Card>
      )}

      {story && !isLoading && (
        <Card className="w-full max-w-xl mx-auto shadow-lg mt-8">
          <CardHeader>
            <CardTitle>Here's a Story about "{topic}":</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/30 rounded-md whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {story}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
