
'use server';
/**
 * @fileOverview A flow to solve a problem from an uploaded image and provide a solution in Bengali.
 *
 * - solveImageProblem - A function that takes an image of a problem and returns a solution.
 * - SolveImageProblemInput - The input type for the solveImageProblem function.
 * - SolveImageProblemOutput - The return type for the solveImageProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveImageProblemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a math, physics, or chemistry problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  studentLevel: z.enum(['Secondary', 'Higher Secondary']).describe('The academic level of the student (Secondary for classes 6-10, Higher Secondary for classes 11-12). This helps tailor the explanation.'),
});
export type SolveImageProblemInput = z.infer<typeof SolveImageProblemInputSchema>;

const SolveImageProblemOutputSchema = z.object({
  solutionText: z.string().describe('A step-by-step solution to the problem in Bengali, explained in a way that is understandable for the specified student level.'),
});
export type SolveImageProblemOutput = z.infer<typeof SolveImageProblemOutputSchema>;

export async function solveImageProblem(
  input: SolveImageProblemInput
): Promise<SolveImageProblemOutput> {
  return solveImageProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveImageProblemPrompt',
  input: {schema: SolveImageProblemInputSchema},
  output: {schema: SolveImageProblemOutputSchema},
  prompt: `You are an expert tutor specializing in helping Secondary (classes 6-10) and Higher Secondary (classes 11-12) students in Bangladesh.
The user has uploaded an image of a problem. Your task is to analyze the image, understand the problem (likely math, physics, or chemistry), and provide a clear, step-by-step solution.

**CRITICAL INSTRUCTIONS:**
1.  **Language**: The entire solution and explanation MUST be in **Bengali (বাংলা)**.
2.  **Clarity**: Explain the solution as if you are teaching a student of the specified \`{{studentLevel}}\` level. Use simple language and break down complex steps.
3.  **Accuracy**: Ensure the solution is mathematically/scientifically correct.
4.  **Completeness**: Provide the full solution, not just the final answer. Show the working.
5.  **Focus**: Only address the problem shown in the image. Do not provide general advice unless it's directly part of solving that specific problem.

Student's Academic Level: {{studentLevel}}

Problem Image:
{{media url=photoDataUri}}

Please provide the solution.
Example output format for a math problem:
{
  "solutionText": "প্রশ্নটি সমাধান করার জন্য, প্রথমে আমাদের প্রদত্ত সমীকরণটি বুঝতে হবে...\nধাপ ১: ...\nধাপ ২: ...\nঅতএব, চূড়ান্ত উত্তর হলো: ..."
}
If the image is unclear or not a solvable academic problem, respond with a polite message in Bengali stating that you cannot solve it. For example:
{
  "solutionText": "দুঃখিত, ছবিটি স্পষ্ট নয় অথবা এটি এমন কোনো সমস্যা নয় যা আমি সমাধান করতে পারি। অনুগ্রহ করে একটি স্পষ্ট academic সমস্যার ছবি আপলোড করুন।"
}
`,
});

const solveImageProblemFlow = ai.defineFlow(
  {
    name: 'solveImageProblemFlow',
    inputSchema: SolveImageProblemInputSchema,
    outputSchema: SolveImageProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
