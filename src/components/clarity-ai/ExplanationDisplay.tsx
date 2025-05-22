import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ExplanationDisplayProps {
  explanation: string | null;
  isLoading: boolean;
}

export function ExplanationDisplay({ explanation, isLoading }: ExplanationDisplayProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Explanation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!explanation) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Explanation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-base leading-relaxed">{explanation}</p>
      </CardContent>
    </Card>
  );
}
