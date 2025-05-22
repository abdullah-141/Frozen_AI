
'use server';

/**
 * @fileOverview A flow to generate a simple explanation of a given topic in a specified language.
 *
 * - generateTopicExplanation - A function that generates a simple explanation of a given topic.
 * - GenerateTopicExplanationInput - The input type for the generateTopicExplanation function.
 * - GenerateTopicExplanationOutput - The return type for the generateTopicExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTopicExplanationInputSchema = z.object({
  topic: z.string().describe('The topic to generate an explanation for.'),
  language: z.enum(['en', 'bn']).default('en').describe('The preferred language for the output (en for English, bn for Bengali).'),
});
export type GenerateTopicExplanationInput = z.infer<typeof GenerateTopicExplanationInputSchema>;

const GenerateTopicExplanationOutputSchema = z.object({
  explanation: z.string().describe('A simple explanation of the topic in the specified language.'),
});
export type GenerateTopicExplanationOutput = z.infer<typeof GenerateTopicExplanationOutputSchema>;

export async function generateTopicExplanation(
  input: GenerateTopicExplanationInput
): Promise<GenerateTopicExplanationOutput> {
  return generateTopicExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTopicExplanationPrompt',
  input: {schema: GenerateTopicExplanationInputSchema},
  output: {schema: GenerateTopicExplanationOutputSchema},
  prompt: `You are an expert in explaining complex topics in simple terms.

Explain the following topic in a way that is easy to understand.
The explanation must be in the language specified by the code '{{language}}' (en for English, bn for Bengali).

Topic: {{topic}}
Language Code: {{language}}`,
});

const generateTopicExplanationFlow = ai.defineFlow(
  {
    name: 'generateTopicExplanationFlow',
    inputSchema: GenerateTopicExplanationInputSchema,
    outputSchema: GenerateTopicExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
