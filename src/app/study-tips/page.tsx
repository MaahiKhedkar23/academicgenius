'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { marked } from 'marked';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  provideStudyTips,
  type ProvideStudyTipsOutput,
} from '@/ai/flows/provide-study-tips';
import { tasks as mockTasks, subjects as mockSubjects } from '@/lib/mock-data';
import { Loader2, Lightbulb } from 'lucide-react';

const tipsFormSchema = z.object({
  learningHabits: z.string().min(10, {
    message: 'Please describe your learning habits in at least 10 characters.',
  }),
  schedule: z.string().min(10, {
    message: 'Please describe your schedule in at least 10 characters.',
  }),
});

export default function StudyTipsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ProvideStudyTipsOutput | null>(null);

  const form = useForm<z.infer<typeof tipsFormSchema>>({
    resolver: zodResolver(tipsFormSchema),
    defaultValues: {
      learningHabits: '',
      schedule: '',
    },
  });

  async function onSubmit(values: z.infer<typeof tipsFormSchema>) {
    setLoading(true);
    setResult(null);

    const subjects = mockSubjects.map(s => s.name).join(', ');
    const taskPriorities = mockTasks.map(t => `${t.priority}: ${t.description}`).join('\n');

    try {
      const res = await provideStudyTips({ ...values, subjects, taskPriorities });
      setResult(res);
       toast({
        title: 'Tips Generated!',
        description: 'Your new AI-powered study tips are ready.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate study tips.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="AI Study Tips"
        description="Get personalized advice to boost your productivity and retention."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Get Your Tips</CardTitle>
            <CardDescription>
              The more details you provide, the better the tips will be.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="learningHabits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Habits</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I'm a visual learner, I get distracted easily by my phone..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        How do you like to learn? What are your strengths and weaknesses?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Schedule</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I have classes Mon-Fri 9am-3pm. I work on weekends..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Describe your typical weekly schedule and commitments.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Study Tips
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="md:col-span-2">
            {loading && (
             <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          )}
          {result && (
            <Card>
              <CardHeader>
                 <div className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-primary"/>
                    <CardTitle>Your Personalized Study Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-stone dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: marked(result.studyTips) }}
                />
              </CardContent>
            </Card>
          )}
           {!loading && !result && (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                <div className="text-center">
                    <p className="text-lg font-medium">Your tips will appear here.</p>
                    <p className="text-sm text-muted-foreground">Fill out the form to get started.</p>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}
