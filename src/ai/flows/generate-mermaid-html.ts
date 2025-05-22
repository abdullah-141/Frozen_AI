
'use server';
/**
 * @fileOverview Generates a self-contained HTML document to render a given Mermaid diagram.
 *
 * - generateMermaidHtml - A function that generates an HTML page for a Mermaid diagram.
 * - GenerateMermaidHtmlInput - The input type for the generateMermaidHtml function.
 * - GenerateMermaidHtmlOutput - The return type for the generateMermaidHtml function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMermaidHtmlInputSchema = z.object({
  mermaidCode: z.string().describe('The Mermaid diagram code to be rendered in HTML.'),
});
export type GenerateMermaidHtmlInput = z.infer<typeof GenerateMermaidHtmlInputSchema>;

const GenerateMermaidHtmlOutputSchema = z.object({
  htmlContent: z
    .string()
    .describe(
      'A complete, self-contained HTML document that renders the provided Mermaid diagram. It should include Mermaid.js from a CDN.'
    ),
});
export type GenerateMermaidHtmlOutput = z.infer<typeof GenerateMermaidHtmlOutputSchema>;

export async function generateMermaidHtml(
  input: GenerateMermaidHtmlInput
): Promise<GenerateMermaidHtmlOutput> {
  return generateMermaidHtmlFlow(input);
}

const MERMAID_CDN_URL = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js';

const generateMermaidHtmlPrompt = ai.definePrompt({
  name: 'generateMermaidHtmlPrompt',
  input: {schema: GenerateMermaidHtmlInputSchema},
  output: {schema: GenerateMermaidHtmlOutputSchema},
  prompt: `You are an expert in web development and Mermaid.js.
Your task is to take the provided Mermaid diagram code and generate a complete, self-contained HTML document that will render this diagram.

**CRITICAL INSTRUCTIONS:**
1.  **Output HTML Only**: Your response MUST be **ONLY** the HTML code. It should start with \`<!DOCTYPE html>\` or \`<html>\` and end with \`</html>\`. Do NOT include any other text, explanations, or markdown formatting (like \`\`\`html ... \`\`\`) before or after the HTML code block.
2.  **Include Mermaid.js CDN**: The HTML document MUST include a \`<script>\` tag to load Mermaid.js version 10.9.0 from the CDN: \`${MERMAID_CDN_URL}\`.
3.  **Mermaid Code Block**: The HTML body must contain a \`<div class="mermaid">\` (or \`<pre class="mermaid">\`) tag. The provided Mermaid diagram code MUST be placed inside this tag.
4.  **Initialize Mermaid**: The HTML must include a script to initialize Mermaid after the diagram code. Use \`mermaid.initialize({ startOnLoad: true, theme: 'neutral' });\`.
5.  **Basic Styling (Optional but good)**: You can include minimal CSS for basic centering or presentation (e.g., body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f0f0f0; } .mermaid { padding: 20px; background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 8px; } ).
6.  **Character Escaping**: Ensure that any special characters within the Mermaid code that might conflict with HTML (like <, >, &) are *not* HTML-escaped when placed inside the mermaid container tag, as Mermaid expects the raw diagram syntax.

Mermaid diagram code to render:
\`\`\`mermaid
{{{mermaidCode}}}
\`\`\`

Generate the complete HTML document now.
`,
});

const generateMermaidHtmlFlow = ai.defineFlow(
  {
    name: 'generateMermaidHtmlFlow',
    inputSchema: GenerateMermaidHtmlInputSchema,
    outputSchema: GenerateMermaidHtmlOutputSchema,
  },
  async input => {
    const {output} = await generateMermaidHtmlPrompt(input);
    let html = output?.htmlContent || "";
    
    // Cleanup potential markdown fences
    if (html.startsWith("```html")) {
        html = html.substring("```html".length);
        if (html.endsWith("```")) {
            html = html.substring(0, html.length - "```".length);
        }
    } else if (html.startsWith("```")) {
        html = html.substring("```".length);
        if (html.endsWith("```")) {
            html = html.substring(0, html.length - "```".length);
        }
    }
    return { htmlContent: html.trim() };
  }
);
