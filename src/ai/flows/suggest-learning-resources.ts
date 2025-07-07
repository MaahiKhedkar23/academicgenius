'use server';

/**
 * @fileOverview A learning resource suggestion AI agent.
 *
 * - suggestLearningResources - A function that suggests learning resources based on subject and task.
 * - SuggestLearningResourcesInput - The input type for the suggestLearningResources function.
 * - SuggestLearningResourcesOutput - The return type for the suggestLearningResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLearningResourcesInputSchema = z.object({
  subject: z.string().describe('The subject for which learning resources are needed.'),
  task: z.string().describe('The specific task or topic for which resources are needed.'),
});
export type SuggestLearningResourcesInput = z.infer<typeof SuggestLearningResourcesInputSchema>;

const SuggestLearningResourcesOutputSchema = z.object({
  resources: z.array(
    z.object({
      title: z.string().describe('The title of the learning resource.'),
      url: z.string().describe('The URL of the learning resource.'),
      type: z.string().describe('The type of learning resource (e.g., article, video, book).'),
      reason: z.string().describe('Why this resource is helpful for the given task and subject'),
    })
  ).describe('A list of suggested learning resources.'),
});
export type SuggestLearningResourcesOutput = z.infer<typeof SuggestLearningResourcesOutputSchema>;

export async function suggestLearningResources(input: SuggestLearningResourcesInput): Promise<SuggestLearningResourcesOutput> {
  return suggestLearningResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLearningResourcesPrompt',
  input: {schema: SuggestLearningResourcesInputSchema},
  output: {schema: SuggestLearningResourcesOutputSchema},
  prompt: `You are an AI assistant designed to suggest relevant learning resources for students.

  Given the subject and task, suggest a list of learning resources that would be helpful.
  Each resource should have a title, URL, type (e.g., article, video, book), and a brief explanation of why it is helpful.

  Subject: {{{subject}}}
  Task: {{{task}}}
  `,
});

const suggestLearningResourcesFlow = ai.defineFlow(
  {
    name: 'suggestLearningResourcesFlow',
    inputSchema: SuggestLearningResourcesInputSchema,
    outputSchema: SuggestLearningResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
