
'use server';

/**
 * @fileOverview A flow to generate a quiz on a given topic.
 *
 * - generateQuiz - A function that generates a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  questionText: z.string().describe('The text of the quiz question.'),
  options: z.array(z.string()).min(2).max(5).describe('An array of possible answers for the question. One of these must be the correct answer.'),
  correctAnswerIndex: z.number().int().min(0).describe('The 0-based index of the correct answer in the options array.'),
  explanation: z.string().optional().describe('A brief explanation for why the answer is correct, especially if the question is tricky.'),
});

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for which the quiz should be generated.'),
  language: z.enum(['en', 'bn']).default('en').describe('The preferred language for the quiz (en for English, bn for Bengali).'),
  numQuestions: z.number().int().min(1).max(10).default(5).describe('The number of questions to generate for the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quizTitle: z.string().describe('A suitable title for the quiz based on the topic.'),
  questions: z.array(QuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;
export type QuizQuestion = z.infer<typeof QuestionSchema>;


export async function generateQuiz(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert quiz creator. Your task is to generate a quiz based on the provided topic, language, and number of questions.

Topic: {{{topic}}}
Language: {{{language}}} (en for English, bn for Bengali)
Number of Questions: {{{numQuestions}}}

Instructions:
1.  Create a relevant title for the quiz in the specified language.
2.  Generate exactly {{{numQuestions}}} multiple-choice questions.
3.  For each question:
    *   Provide clear question text in the specified '{{language}}'.
    *   Provide 2 to 5 plausible options, also in '{{language}}'.
    *   Indicate the 0-based index of the correct answer.
    *   Optionally, provide a brief explanation for the correct answer, especially for more complex questions. This should also be in '{{language}}'.
4.  Ensure all text content (title, questions, options, explanations) is in the specified '{{language}}'.
5.  The output MUST strictly follow the provided JSON schema.

Example for topic "Solar System" in English, 2 questions:
{
  "quizTitle": "Solar System Challenge",
  "questions": [
    {
      "questionText": "Which planet is known as the Red Planet?",
      "options": ["Earth", "Mars", "Jupiter", "Saturn"],
      "correctAnswerIndex": 1,
      "explanation": "Mars is known as the Red Planet due to iron oxide prevalent on its surface."
    },
    {
      "questionText": "What is the largest planet in our Solar System?",
      "options": ["Venus", "Mars", "Jupiter", "Neptune"],
      "correctAnswerIndex": 2
    }
  ]
}

Example for topic "মুক্তিযুদ্ধ" (Liberation War) in Bengali, 1 question:
{
  "quizTitle": "মুক্তিযুদ্ধ কুইজ",
  "questions": [
    {
      "questionText": "বাংলাদেশের মুক্তিযুদ্ধ কত সালে সংঘটিত হয়েছিল?",
      "options": ["১৯৫২", "১৯৭১", "১৯৪৭", "১৯৬৯"],
      "correctAnswerIndex": 1,
      "explanation": "১৯৭১ সালে নয় মাসব্যাপী রক্তক্ষয়ী মুক্তিযুদ্ধের মাধ্যমে বাংলাদেশ স্বাধীনতা অর্জন করে।"
    }
  ]
}
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

