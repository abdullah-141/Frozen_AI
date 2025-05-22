
// src/ai/flows/generate-mermaid-diagram.ts
'use server';

/**
 * @fileOverview Generates a Mermaid diagram or flowchart for a given topic in a specified language.
 *
 * - generateMermaidDiagram - A function that generates a Mermaid diagram.
 * - GenerateMermaidDiagramInput - The input type for the generateMermaidDiagram function.
 * - GenerateMermaidDiagramOutput - The return type for the generateMermaidDiagram function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMermaidDiagramInputSchema = z.object({
  topic: z.string().describe('The complex topic to visualize as a Mermaid diagram.'),
  language: z.enum(['en', 'bn']).default('en').describe('The preferred language for text within the diagram (en for English, bn for Bengali).'),
});
export type GenerateMermaidDiagramInput = z.infer<typeof GenerateMermaidDiagramInputSchema>;

const GenerateMermaidDiagramOutputSchema = z.object({
  diagram: z
    .string()
    .describe(
      'A Mermaid diagram or flowchart representing the topic, using Mermaid syntax, with text in the specified language.'
    ),
});
export type GenerateMermaidDiagramOutput = z.infer<typeof GenerateMermaidDiagramOutputSchema>;

export async function generateMermaidDiagram(
  input: GenerateMermaidDiagramInput
): Promise<GenerateMermaidDiagramOutput> {
  return generateMermaidDiagramFlow(input);
}

const generateMermaidDiagramPrompt = ai.definePrompt({
  name: 'generateMermaidDiagramPrompt',
  input: {schema: GenerateMermaidDiagramInputSchema},
  output: {schema: GenerateMermaidDiagramOutputSchema},
  prompt: `You are an expert in creating Mermaid diagrams and flowcharts. Your primary goal is to generate syntactically PERFECT and CLEAR Mermaid code.

Topic: {{{topic}}}
Language for diagram text: {{{language}}} (en for English, bn for Bengali. All text in the diagram MUST be in this language.)

**CRITICAL INSTRUCTIONS:**

1.  **OUTPUT FORMAT IS PARAMOUNT:**
    *   Your response MUST be **ONLY** the Mermaid diagram code.
    *   The VERY FIRST line of your output MUST be the diagram type keyword (e.g., "graph TD", "flowchart TD").
    *   Do NOT include any other text, explanations, titles, or markdown formatting (like \`\`\`mermaid or \`\`\`) before or after the Mermaid code block.
    *   The output must be 100% directly renderable by Mermaid.js (version 10.9.x).

2.  **ENSURE SYNTACTIC VALIDITY:**
    *   **Quoting is Key**: ALL node text, edge labels, or any text containing spaces, special characters (like :, -, !, etc.), or non-ASCII characters (e.g., Bengali script) MUST be correctly quoted. Example: \`A["Node with spaces: Example"] --> B["বাংলা টেক্সট"]\`. Use double quotes.
    *   **Node IDs**: Keep Node IDs simple and alphanumeric (e.g., \`node1\`, \`itemA\`). Do NOT use spaces or special characters in IDs.
    *   **Arrow Types**: Use standard arrow types like \`-->\`, \`---\`, \`==>\`.
    *   **Balanced Constructs**: Ensure all parentheses \`()\`, brackets \`[]\`, and braces \`{}\` are correctly paired and balanced.
    *   **Keywords**: Use correct keywords for diagram types (e.g., \`graph TD\`, \`flowchart TD\`, \`subgraph\`, \`end\`).

3.  **DIAGRAM TYPE AND COMPLEXITY:**
    *   **Prefer Robust Types**: If the topic is complex or you are unsure, **STRONGLY PREFER \`flowchart TD\` or \`graph TD\`**. These are less prone to syntax errors.
    *   **Simplicity Over Flair**: A simpler, 100% correct diagram is VASTLY SUPERIOR to a complex one that fails to render. Avoid experimental or overly complex Mermaid features.
    *   **Subgraphs**: Only use subgraphs if essential for clarity and if you can guarantee their syntax is perfect. Simple structures are safer.

4.  **CONTENT AND CLARITY:**
    *   Analyze the topic to determine the most effective Mermaid diagram type to explain its core concepts.
    *   The diagram should be clear, concise, and visually appealing.
    *   All text within the diagram (node labels, edge labels, etc.) MUST be in the specified language ('{{language}}').

**Double-check your output for ANY non-Mermaid content or syntax errors before responding.**
Your entire response should be ONLY the Mermaid code.
`,
});

const generateMermaidDiagramFlow = ai.defineFlow(
  {
    name: 'generateMermaidDiagramFlow',
    inputSchema: GenerateMermaidDiagramInputSchema,
    outputSchema: GenerateMermaidDiagramOutputSchema,
  },
  async input => {
    const {output} = await generateMermaidDiagramPrompt(input);
    
    // Ensure the output.diagram is a string and perform cleanup
    let diagramCode = "";
    if (output && typeof output.diagram === 'string') {
        diagramCode = output.diagram.trim();

        // More robust removal of markdown fences and surrounding text
        // Remove ```mermaid ... ``` or ``` ... ```
        if (diagramCode.startsWith("```mermaid")) {
            diagramCode = diagramCode.substring("```mermaid".length);
            if (diagramCode.endsWith("```")) {
                diagramCode = diagramCode.substring(0, diagramCode.length - "```".length);
            }
        } else if (diagramCode.startsWith("```")) {
            diagramCode = diagramCode.substring("```".length);
            if (diagramCode.endsWith("```")) {
                diagramCode = diagramCode.substring(0, diagramCode.length - "```".length);
            }
        }
        // Trim again after potential removals
        diagramCode = diagramCode.trim();
    }
    
    return { diagram: diagramCode };
  }
);

