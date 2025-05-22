
'use server';
/**
 * @fileOverview A flow to generate a simple and fun story to explain a complex topic.
 *
 * - generateLearningStory - A function that generates a story explanation.
 * - GenerateLearningStoryInput - The input type for the function.
 * - GenerateLearningStoryOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateLearningStoryInputSchema = z.object({
  topic: z.string().describe('The complex topic to explain with a story.'),
  language: z.enum(['en', 'bn']).default('en').describe('The preferred language for the story (en for English, bn for Bengali).'),
});
export type GenerateLearningStoryInput = z.infer<typeof GenerateLearningStoryInputSchema>;

const GenerateLearningStoryOutputSchema = z.object({
  storyText: z.string().describe('A simple, fun, and engaging story that explains the topic in the specified language, potentially including a few relevant emojis.'),
});
export type GenerateLearningStoryOutput = z.infer<typeof GenerateLearningStoryOutputSchema>;

export async function generateLearningStory(
  input: GenerateLearningStoryInput
): Promise<GenerateLearningStoryOutput> {
  return generateLearningStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningStoryPrompt',
  input: { schema: GenerateLearningStoryInputSchema },
  output: { schema: GenerateLearningStoryOutputSchema },
  prompt: `You are a masterful storyteller who can explain complex topics to learners of all ages through simple, fun, and engaging narratives.

Topic to explain: {{{topic}}}
Language for the story: {{{language}}} (en for English, bn for Bengali)

Instructions:
1.  Craft a story that clearly explains the core concepts of the "{{topic}}".
2.  The story MUST be in the specified '{{language}}'.
3.  Make the story easy to understand, avoiding jargon where possible or explaining it simply within the narrative.
4.  The tone should be lighthearted, fun, and engaging.
5.  Naturally incorporate 2-3 relevant emojis 🥳✨🌱 into the story to make it more lively. Do not overdo it with emojis.
6.  The story should be concise yet comprehensive enough to cover the main aspects of the topic.
7.  Ensure the output is only the story text.

Example for topic "Photosynthesis" in English:
{
  "storyText": "Once upon a time, in a sunny garden ☀️, lived a little plant named Pip 🌱. Pip was always hungry, but he didn't eat sandwiches like humans do! Instead, Pip had a magical kitchen inside his green leaves. When the sun shined brightly, Pip would take a deep breath of air (carbon dioxide) and a long sip of water from the ground through his roots. Inside his leaf-kitchen, with the help of sunlight (his super chef!), he would mix the air and water to cook his own sugary food! This amazing cooking process is called Photosynthesis. And guess what? As a thank you for the sunshine, Pip would release fresh air (oxygen) for everyone to breathe. So, Pip not only fed himself but also helped keep the air clean and fresh! 🌬️"
}

Example for topic "সৌর প্যানেল" (Solar Panel) in Bengali:
{
  "storyText": "এক দেশে ছিল ছোট একটা বাড়ি, তার ছাদে থাকত কিছু চকচকে কাঁচের ফলক, নাম তার সৌর প্যানেল 🏠. সৌর প্যানেল ছিল খুব চালাক। সে সূর্যের আলো দেখলেই খুশি হয়ে যেত আর ভাবত, 'এই আলো দিয়েই তো জাদু করা যায়!' যেই না সূর্য উঠত ☀️, অমনি সৌর প্যানেল তার কাঁচের শরীর দিয়ে সূর্যের আলো শুষে নিত। তারপর সেই আলো দিয়ে সে বিদ্যুৎ তৈরি করত, ঠিক যেন এক জাদুকর 🧙‍♂️! সেই বিদ্যুৎ দিয়ে বাড়ির লাইট জ্বলত, ফ্যান ঘুরত, টিভি চলত। সৌর প্যানেল এভাবেই সূর্য মামার আলো কাজে লাগিয়ে সবাইকে সাহায্য করত আর পরিবেশও ভালো রাখত, কারণ সে কোনো ধোঁয়া তৈরি করত না। দারুণ ব্যাপার, তাই না?"
}
`,
});

const generateLearningStoryFlow = ai.defineFlow(
  {
    name: 'generateLearningStoryFlow',
    inputSchema: GenerateLearningStoryInputSchema,
    outputSchema: GenerateLearningStoryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);

