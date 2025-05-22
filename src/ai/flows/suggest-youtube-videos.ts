// This flow is no longer used and has been replaced by a direct YouTube search link.
// Keeping the file to avoid breaking imports if it's referenced elsewhere unexpectedly,
// but its functionality is removed.
'use server';
import { z } from 'genkit';

export const SuggestYoutubeVideosInputSchema = z.object({
  topic: z.string().optional(),
  language: z.enum(['en', 'bn']).default('en').optional(),
});
export type SuggestYoutubeVideosInput = z.infer<typeof SuggestYoutubeVideosInputSchema>;

export const VideoSuggestionSchema = z.object({
  title: z.string().optional(),
  url: z.string().optional(),
  id: z.string().optional(),
});
export type VideoSuggestion = z.infer<typeof VideoSuggestionSchema>;

export const SuggestYoutubeVideosOutputSchema = z.object({
  videos: z.array(VideoSuggestionSchema).max(3).optional(),
});
export type SuggestYoutubeVideosOutput = z.infer<typeof SuggestYoutubeVideosOutputSchema>;

export async function suggestYoutubeVideos(
  input: SuggestYoutubeVideosInput
): Promise<SuggestYoutubeVideosOutput> {
  console.warn("suggestYoutubeVideos flow called but is deprecated. Returning empty array.");
  return { videos: [] };
}
