
// This flow is no longer used and can be safely removed.
// The "Specials" page now uses a static TTS welcome.
'use server';
/**
 * @fileOverview A flow to generate a friendly welcome message.
 *
 * - generateWelcomeMessage - A function that generates a welcome message.
 * - GenerateWelcomeMessageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// No specific input schema needed for a generic welcome message
const GenerateWelcomeMessageOutputSchema = z.object({
  welcomeText: z.string().describe("A short, happy, and uplifting welcome message for a user visiting a special accessibility-focused section of the website. It should be similar in tone and content to: 'Heyy, what do you want to explore today?'"),
});
export type GenerateWelcomeMessageOutput = z.infer<typeof GenerateWelcomeMessageOutputSchema>;

export async function generateWelcomeMessage(): Promise<GenerateWelcomeMessageOutput> {
  console.warn("generateWelcomeMessage flow was called but is deprecated. Returning a default message.");
  return { welcomeText: "Welcome! How can I help you today?" };
  // return generateWelcomeMessageFlow({}); // Original call commented out
}

/*
// Original prompt and flow definition commented out as it's no longer used.
const prompt = ai.definePrompt({
  name: 'generateWelcomeMessagePrompt',
  output: { schema: GenerateWelcomeMessageOutputSchema },
  prompt: `You are a friendly and enthusiastic assistant.
Generate a very short, happy, and uplifting welcome message for a user visiting a special accessibility-focused section of a website.
The message should be similar in tone and content to: "Heyy, what do you want to explore today?"
Keep it concise and welcoming.
Example: "Hello there! Ready to see what's special for you today?"
Another Example: "Welcome! What amazing things shall we discover?"
`,
});

const generateWelcomeMessageFlow = ai.defineFlow(
  {
    name: 'generateWelcomeMessageFlow',
    // No input schema needed if it's always a generic welcome
    outputSchema: GenerateWelcomeMessageOutputSchema,
  },
  async () => {
    const { output } = await prompt({});
    return output!;
  }
);
*/

    