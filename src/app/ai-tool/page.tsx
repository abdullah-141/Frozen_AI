
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, AlertTriangle, Home } from "lucide-react"; 
import { TopicInputForm } from "@/components/clarity-ai/TopicInputForm";
import { ExplanationDisplay } from "@/components/clarity-ai/ExplanationDisplay";
import { MermaidDiagramDisplay } from "@/components/clarity-ai/MermaidDiagramDisplay";
import { SimilarConceptsDisplay } from "@/components/clarity-ai/SimilarConceptsDisplay";
import { VideoSuggestionsDisplay } from "@/components/clarity-ai/VideoSuggestionsDisplay";
import { generateTopicExplanation, type GenerateTopicExplanationOutput } from "@/ai/flows/generate-topic-explanation";
import { generateMermaidDiagram, type GenerateMermaidDiagramOutput } from "@/ai/flows/generate-mermaid-diagram";
import { generateSimilarConcepts, type GenerateSimilarConceptsOutput } from "@/ai/flows/generate-similar-concepts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";


export default function ClarityAIPage() {
  const [topic, setTopic] = useState<string>("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [diagram, setDiagram] = useState<string | null>(null);
  const [similarConcepts, setSimilarConcepts] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [language, setLanguage] = useState<"en" | "bn">("en"); 

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const handleSearch = async (currentTopic: string) => {
    setTopic(currentTopic); 
    
    setIsLoading(true);
    setError(null);
    setExplanation(null);
    setDiagram(null);
    setSimilarConcepts(null);

    try {
      const [explanationRes, diagramRes, conceptsRes] = await Promise.all([
        generateTopicExplanation({ topic: currentTopic, language }),
        generateMermaidDiagram({ topic: currentTopic, language }),
        generateSimilarConcepts({ topic: currentTopic, language }),
      ]);

      setExplanation((explanationRes as GenerateTopicExplanationOutput).explanation);
      setDiagram((diagramRes as GenerateMermaidDiagramOutput).diagram);
      setSimilarConcepts((conceptsRes as GenerateSimilarConceptsOutput).concepts);

    } catch (e: any) {
      console.error("Error fetching data:", e);
      let displayError = `An error occurred: ${e.message || "Please try again."}`;
      if (e.message && (e.message.includes("503") || e.message.toLowerCase().includes("overloaded") || e.message.toLowerCase().includes("service unavailable"))) {
        displayError = "The AI model is currently experiencing high demand or is temporarily unavailable. Please try again in a few moments.";
      } else if (e.message && (e.message.toLowerCase().includes("api key not valid") || e.message.toLowerCase().includes("youtube data api")) ) {
         displayError = "There might be an issue with an API configuration, potentially with the YouTube Data API. If the problem persists, try again later or verify the API key and its permissions in the Google Cloud Console.";
      } else if (e.message && e.message.toLowerCase().includes("failed to fetch")) {
        displayError = "A network error occurred. Please check your internet connection and try again.";
      }
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConceptClick = (concept: string) => {
    const topicInput = document.querySelector('input[name="topic"]') as HTMLInputElement | null;
    if (topicInput) {
      topicInput.value = concept; 
    }
    handleSearch(concept);
  };

  const showExplanationResults = explanation || (isLoading && !explanation);
  const showDiagramResults = diagram || (isLoading && !diagram);
  const showSimilarConceptsResults = (similarConcepts && similarConcepts.length > 0) || (isLoading && !similarConcepts);
  const showVideoLinkSection = !!topic && !isLoading && !error;

  const showResultsArea = showExplanationResults || showDiagramResults || showSimilarConceptsResults || showVideoLinkSection;

  const noPrimaryResults = !explanation && !diagram && (!similarConcepts || similarConcepts.length === 0);
  const showNoResultsMessage = !isLoading && !error && noPrimaryResults && topic;
  const showInitialMessage = !isLoading && !error && noPrimaryResults && !topic;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" suppressHydrationWarning>
      <header className="py-6 px-4 sm:px-6 md:px-8 border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4"> 
            <Link href="/" passHref>
              <Button variant="outline" size="icon" aria-label="Back to Homepage">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Zap className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Frozen Voltage AI
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 flex-grow w-full">
        <section id="controls" className="mb-8 space-y-6">
          <TopicInputForm 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            currentLanguage={language}
            onLanguageChange={setLanguage} 
          />
        </section>

        {error && (
          <Alert variant="destructive" className="mb-8 shadow-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <Button variant="link" onClick={() => setError(null)} className="p-0 h-auto ml-2 text-destructive-foreground hover:underline">Dismiss</Button>
            </AlertDescription>
          </Alert>
        )}

        {showResultsArea && (
            <div className="space-y-8">
                <ExplanationDisplay explanation={explanation} isLoading={isLoading && !explanation} />
                <MermaidDiagramDisplay diagramCode={diagram} isLoading={isLoading && !diagram} />
                {showVideoLinkSection && <VideoSuggestionsDisplay topic={topic} language={language} />}
                <SimilarConceptsDisplay 
                  concepts={similarConcepts} 
                  isLoading={isLoading && !similarConcepts} 
                  onConceptClick={handleConceptClick}
                />
            </div>
        )}
        
        {showNoResultsMessage && (
          <div className="text-center text-muted-foreground py-10">
            <p>No results found for "{topic}". Try a different topic.</p>
          </div>
        )}
         {showInitialMessage && (
          <div className="text-center text-muted-foreground py-10">
            <p className="text-lg">Enter a topic above to get started!</p>
            <p className="text-sm mt-1">Let Frozen Voltage AI break down complex subjects for you.</p>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-12">
        <p>Developed by Team Frozen Voltage. Copyright © {currentYear !== null ? currentYear : '...'}.</p>
      </footer>
    </div>
  );
}
