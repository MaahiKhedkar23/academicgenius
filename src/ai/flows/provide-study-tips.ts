'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized study tips to students.
 *
 * The flow analyzes learning habits and offers smart, customized study tips.
 * - provideStudyTips - A function that returns study tips based on input.
 * - ProvideStudyTipsInput - The input type for the provideStudyTips function.
 * - ProvideStudyTipsOutput - The return type for the provideStudyTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideStudyTipsInputSchema = z.object({
  learningHabits: z
    .string()
    .describe('Description of the student learning habits and preferences.'),
  schedule: z.string().describe('The student schedule.'),
  subjects: z.string().describe('The subjects the student is studying.'),
  taskPriorities: z.string().describe('Prioritized list of tasks.'),
});
export type ProvideStudyTipsInput = z.infer<typeof ProvideStudyTipsInputSchema>;

const ProvideStudyTipsOutputSchema = z.object({
  studyTips: z.string().describe('Personalized study tips for the student.'),
});
export type ProvideStudyTipsOutput = z.infer<typeof ProvideStudyTipsOutputSchema>;

export async function provideStudyTips(input: ProvideStudyTipsInput): Promise<ProvideStudyTipsOutput> {
  return provideStudyTipsFlow(input);
}

const provideStudyTipsPrompt = ai.definePrompt({
  name: 'provideStudyTipsPrompt',
  input: {schema: ProvideStudyTipsInputSchema},
  output: {schema: ProvideStudyTipsOutputSchema},
  prompt: `You are an AI study advisor who provides personalized study tips to students based on their learning habits, schedule, subjects, and task priorities.

  Learning Habits: {{{learningHabits}}}
  Schedule: {{{schedule}}}
  Subjects: {{{subjects}}}
  Task Priorities: {{{taskPriorities}}}

  Based on the information above, provide study tips to help the student optimize their study techniques and improve knowledge retention.
  The study tips should be clear, actionable, and tailored to the student's specific circumstances.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const provideStudyTipsFlow = ai.defineFlow(
  {
    name: 'provideStudyTipsFlow',
    inputSchema: ProvideStudyTipsInputSchema,
    outputSchema: ProvideStudyTipsOutputSchema,
  },
  async input => {
    const {output} = await provideStudyTipsPrompt(input);
    return output!;
  }
);
