
'use server';
/**
 * @fileOverview A flow to find animated educational YouTube videos for a given topic.
 *
 * - findAnimatedYoutubeVideos - A function that fetches animated YouTube video suggestions.
 * - FindAnimatedYoutubeVideosInput - The input type for the function.
 * - FindAnimatedYoutubeVideosOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { YouTubeVideo } from '@/services/youtube';
import { searchAnimatedEducationalVideos } from '@/services/youtube';

const FindAnimatedYoutubeVideosInputSchema = z.object({
  topic: z.string().describe('The topic to search for animated educational videos.'),
  language: z.enum(['en', 'bn']).default('en').describe('The preferred language for video content (en for English, bn for Bengali).'),
});
export type FindAnimatedYoutubeVideosInput = z.infer<typeof FindAnimatedYoutubeVideosInputSchema>;

const VideoSchema = z.object({
  id: z.string().describe('The YouTube video ID.'),
  title: z.string().describe('The title of the YouTube video.'),
  description: z.string().describe('A brief description of the YouTube video.'),
  thumbnailUrl: z.string().url().describe('The URL of the video thumbnail image.'),
  url: z.string().url().describe('The URL of the YouTube video.'),
});

const FindAnimatedYoutubeVideosOutputSchema = z.object({
  videos: z.array(VideoSchema).max(6).describe('An array of suggested animated YouTube videos, up to 6 videos.'),
});
export type FindAnimatedYoutubeVideosOutput = z.infer<typeof FindAnimatedYoutubeVideosOutputSchema>;


const fetchAnimatedVideosTool = ai.defineTool(
  {
    name: 'fetchAnimatedVideosTool',
    description: 'Fetches a list of relevant animated educational YouTube videos for a given topic and language using the YouTube Data API. Filters for public, embeddable videos.',
    inputSchema: FindAnimatedYoutubeVideosInputSchema,
    outputSchema: FindAnimatedYoutubeVideosOutputSchema,
  },
  async (input) => {
    try {
      const videos: YouTubeVideo[] = await searchAnimatedEducationalVideos(input.topic, input.language);
      return { videos };
    } catch (error: any) {
      console.error("Error in fetchAnimatedVideosTool:", error);
      // Return empty array in case of error to prevent flow failure
      return { videos: [] };
    }
  }
);

const findAnimatedYoutubeVideosFlow = ai.defineFlow(
  {
    name: 'findAnimatedYoutubeVideosFlow',
    inputSchema: FindAnimatedYoutubeVideosInputSchema,
    outputSchema: FindAnimatedYoutubeVideosOutputSchema,
    tools: [fetchAnimatedVideosTool],
  },
  async (input) => {
    // Directly call the tool. The tool itself handles the search and filtering.
    // No LLM selection needed here if the tool provides the final list.
    const toolResponse = await fetchAnimatedVideosTool(input);
    return toolResponse;
  }
);

export async function findAnimatedYoutubeVideos(
  input: FindAnimatedYoutubeVideosInput
): Promise<FindAnimatedYoutubeVideosOutput> {
  return findAnimatedYoutubeVideosFlow(input);
}

