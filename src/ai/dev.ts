
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-topic-explanation.ts';
import '@/ai/flows/generate-mermaid-diagram.ts';
import '@/ai/flows/generate-mermaid-html.ts';
import '@/ai/flows/generate-similar-concepts.ts';
// import '@/ai/flows/suggest-youtube-videos.ts'; // Replaced with direct search link
import '@/ai/flows/generate-quiz-flow.ts';
import '@/ai/flows/solve-image-problem-flow.ts';
import '@/ai/flows/find-animated-youtube-videos.ts';
import '@/ai/flows/generate-learning-story.ts';
// import '@/ai/flows/generate-welcome-message.ts'; // Removed as it's no longer used by /special page


    