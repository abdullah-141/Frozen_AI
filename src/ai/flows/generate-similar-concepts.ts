
'use server';

/**
 * @fileOverview A flow to generate a list of similar or related concepts for a given topic.
 *
 * - generateSimilarConcepts - A function that generates related concepts.
 * - GenerateSimilarConceptsInput - The input type for the generateSimilarConcepts function.
 * - GenerateSimilarConceptsOutput - The return type for the generateSimilarConcepts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSimilarConceptsInputSchema = z.object({
  topic: z.string().describe('The topic to generate similar concepts for.'),
  language: z.enum(['en', 'bn']).default('en').describe('The preferred language for the concepts (en for English, bn for Bengali).'),
});
export type GenerateSimilarConceptsInput = z.infer<typeof GenerateSimilarConceptsInputSchema>;

const GenerateSimilarConceptsOutputSchema = z.object({
  concepts: z
    .array(z.string())
    .max(5)
    .describe('An array of 3 to 5 concise terms or concepts related to the input topic, in the specified language.'),
});
export type GenerateSimilarConceptsOutput = z.infer<typeof GenerateSimilarConceptsOutputSchema>;

export async function generateSimilarConcepts(
  input: GenerateSimilarConceptsInput
): Promise<GenerateSimilarConceptsOutput> {
  return generateSimilarConceptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSimilarConceptsPrompt',
  input: {schema: GenerateSimilarConceptsInputSchema},
  output: {schema: GenerateSimilarConceptsOutputSchema},
  prompt: `You are an expert at identifying related topics and concepts.

Based on the topic "{{topic}}", provide a list of 3 to 5 similar or closely related concepts or terms.
The concepts should be concise and in the language specified by the code '{{language}}' (en for English, bn for Bengali).
Present these concepts as a simple list of strings.

Topic: {{topic}}
Language Code: {{language}}

Example for topic "Machine Learning" in English:
Output: { "concepts": ["Deep Learning", "Artificial Intelligence", "Data Mining", "Natural Language Processing", "Computer Vision"] }

Example for topic " जलवायु परिवर्तन" (Climate Change) in Bengali:
Output: { "concepts": ["বিশ্ব উষ্ণায়ন", "গ্রিনহাউস গ্যাস", "কার্বন নিঃসরণ", "নবায়নযোগ্য শক্তি", "পরিবেশ দূষণ"] }
`,
});

const generateSimilarConceptsFlow = ai.defineFlow(
  {
    name: 'generateSimilarConceptsFlow',
    inputSchema: GenerateSimilarConceptsInputSchema,
    outputSchema: GenerateSimilarConceptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output ? { concepts: output.concepts || [] } : { concepts: [] };
  }
);
