
"use client";

import type { GenerateQuizOutput, QuizQuestion } from "@/ai/flows/generate-quiz-flow";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertTriangle, RotateCcw } from "lucide-react";

interface QuizDisplayProps {
  quizData: GenerateQuizOutput;
  onRetake?: () => void;
}

export function QuizDisplay({ quizData, onRetake }: QuizDisplayProps) {
  const [userAnswers, setUserAnswers] = useState<Array<number | null>>(
    Array(quizData.questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Reset state if quizData changes (e.g., new quiz loaded)
  useEffect(() => {
    setUserAnswers(Array(quizData.questions.length).fill(null));
    setSubmitted(false);
    setScore(0);
  }, [quizData]);

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let currentScore = 0;
    quizData.questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswerIndex) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setSubmitted(true);
  };

  const getOptionLabel = (optionIndex: number) => String.fromCharCode(65 + optionIndex); // A, B, C...

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
            Quiz Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>No quiz questions available. Please try generating the quiz again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold">{quizData.quizTitle}</CardTitle>
        {submitted && (
          <CardDescription className="text-xl font-semibold pt-2">
            Your Score: {score} out of {quizData.questions.length}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {quizData.questions.map((question: QuizQuestion, qIndex: number) => (
          <div key={qIndex} className="p-4 border rounded-lg shadow-sm bg-card">
            <p className="font-semibold text-lg mb-3">
              Question {qIndex + 1}: {question.questionText}
            </p>
            <RadioGroup
              value={userAnswers[qIndex] !== null ? userAnswers[qIndex]!.toString() : undefined}
              onValueChange={(value) => handleOptionChange(qIndex, parseInt(value))}
              disabled={submitted}
              className="space-y-2"
            >
              {question.options.map((option, oIndex) => {
                const isCorrect = oIndex === question.correctAnswerIndex;
                const isSelected = userAnswers[qIndex] === oIndex;
                
                let optionStyle = "border-muted-foreground/30";
                if (submitted) {
                  if (isCorrect) optionStyle = "border-green-500 bg-green-500/10 ring-2 ring-green-500";
                  else if (isSelected && !isCorrect) optionStyle = "border-red-500 bg-red-500/10 ring-2 ring-red-500";
                } else if (isSelected) {
                    optionStyle = "border-primary ring-2 ring-primary";
                }


                return (
                  <Label
                    key={oIndex}
                    htmlFor={`q${qIndex}-o${oIndex}`}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-all hover:bg-muted/50 ${optionStyle} ${submitted ? 'cursor-default' : ''}`}
                  >
                    <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} className="sr-only" />
                    <span className={`mr-3 font-medium py-1 px-2 rounded ${submitted && isCorrect ? 'bg-green-500 text-white' : submitted && isSelected && !isCorrect ? 'bg-red-500 text-white' : 'bg-muted'}`}>
                      {getOptionLabel(oIndex)}
                    </span>
                    <span className="flex-grow">{option}</span>
                    {submitted && isCorrect && <CheckCircle className="h-5 w-5 text-green-500 ml-2" />}
                    {submitted && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 ml-2" />}
                  </Label>
                );
              })}
            </RadioGroup>
            {submitted && question.explanation && (
              <div className={`mt-3 p-3 rounded-md text-sm ${userAnswers[qIndex] === question.correctAnswerIndex ? 'bg-green-500/10 text-green-700 dark:text-green-300' : 'bg-muted'}`}>
                <strong>Explanation:</strong> {question.explanation}
              </div>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
        {!submitted ? (
          <Button onClick={handleSubmit} size="lg" className="w-full sm:w-auto">
            Submit Answers
          </Button>
        ) : (
          <Button onClick={onRetake || (() => window.location.reload())} size="lg" variant="outline" className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Quiz / New Topic
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
