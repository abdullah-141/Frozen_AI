
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";

interface SimilarConceptsDisplayProps {
  concepts: string[] | null;
  isLoading: boolean;
  onConceptClick: (concept: string) => void;
}

export function SimilarConceptsDisplay({ concepts, isLoading, onConceptClick }: SimilarConceptsDisplayProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            Explore Similar Concepts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-9 w-28 rounded-md" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!concepts || concepts.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-primary" />
          Explore Similar Concepts
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {concepts.map((concept, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onConceptClick(concept)}
            className="bg-accent/10 text-foreground border-accent/30 hover:bg-accent hover:text-accent-foreground"
          >
            {concept}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

