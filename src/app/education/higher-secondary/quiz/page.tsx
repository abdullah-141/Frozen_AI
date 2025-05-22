
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertTriangle, Edit } from "lucide-react";
import { QuizDisplay } from "@/components/education/QuizDisplay";
import { generateQuiz, type GenerateQuizInput, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow";
import { useToast } from "@/hooks/use-toast";
// Removed useLanguage import

export default function HigherSecondaryQuizPage() {
  const [topic, setTopic] = useState("");
  const language: "en" | "bn" = "bn"; // Default language for this page
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizData, setQuizData] = useState<GenerateQuizOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for the quiz.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setQuizData(null);

    try {
      const input: GenerateQuizInput = { 
        topic, 
        language, 
        numQuestions: Number(numQuestions) 
      };
      const result = await generateQuiz(input);
       if (result && result.questions && result.questions.length > 0) {
        setQuizData(result);
      } else {
        setError("The AI failed to generate quiz questions. Please try a different topic or adjust settings.");
        setQuizData(null);
      }
    } catch (e: any) {
      console.error("Error generating quiz:", e);
      setError(`Failed to generate quiz: ${e.message || "Please try again."}`);
      setQuizData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setQuizData(null);
    // Optionally clear topic: setTopic("");
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center">
            <Edit className="mr-3 h-8 w-8 text-primary" />
            উচ্চ মাধ্যমিক স্তরের কুইজ
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          যেকোনো বিষয়ে আপনার জ্ঞান যাচাই করুন।
        </p>
      </div>

      {!quizData ? (
        <Card className="w-full max-w-lg mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Generate New Quiz</CardTitle>
            <CardDescription>Enter a topic and select your preferences. The quiz will be in Bengali (বাংলা).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topic-input">Topic (e.g., "Calculus", "Organic Chemistry", "তড়িৎচুম্বকত্ব")</Label>
              <Input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter quiz topic"
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="num-questions-select">Number of Questions</Label>
              <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(parseInt(value))} disabled={isLoading}>
                <SelectTrigger id="num-questions-select" className="w-full mt-1">
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && (
              <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">
                <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <Button onClick={handleGenerateQuiz} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                "Generate Quiz"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <QuizDisplay quizData={quizData} onRetake={handleRetake} />
      )}
    </div>
  );
}
