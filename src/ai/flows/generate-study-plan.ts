'use server';

/**
 * @fileOverview Generates a personalized study plan using AI based on user tasks and preferences.
 *
 * - generateStudyPlan - A function that generates the study plan.
 * - GenerateStudyPlanInput - The input type for the generateStudyPlan function.
 * - GenerateStudyPlanOutput - The return type for the generateStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyPlanInputSchema = z.object({
  tasks: z.array(
    z.object({
      subject: z.string().describe('The subject of the task.'),
      description: z.string().describe('A description of the task.'),
      deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DD).'),
      priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the task.'),
    })
  ).describe('A list of tasks with their subject, description, deadline and priority.'),
  learningPreferences: z.string().describe('The learning preferences of the student.'),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const GenerateStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('A detailed study plan, including schedule, topics, and resources.'),
});
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return generateStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: {schema: GenerateStudyPlanInputSchema},
  output: {schema: GenerateStudyPlanOutputSchema},
  prompt: `You are an AI academic planner. Generate a personalized study plan for the student based on the following information:

Tasks:
{{#each tasks}}
- Subject: {{this.subject}}
  Description: {{this.description}}
  Deadline: {{this.deadline}}
  Priority: {{this.priority}}
{{/each}}

Learning Preferences: {{learningPreferences}}

Consider the deadlines and priorities of the tasks when creating the study plan. Suggest optimal learning resources to enhance subject comprehension. The study plan should be detailed, including schedule, topics, and resources.`,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
