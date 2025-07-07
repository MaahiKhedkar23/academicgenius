'use client';

import * as React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { tasks as mockTasks } from '@/lib/mock-data';
import { generateStudyPlan, type GenerateStudyPlanOutput } from '@/ai/flows/generate-study-plan';
import { Bot, Loader2 } from 'lucide-react';
import { marked } from 'marked';

export default function StudyPlanPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<GenerateStudyPlanOutput | null>(null);
  const [preferences, setPreferences] = React.useState('');

  async function onSubmit() {
    if (mockTasks.length === 0) {
      toast({
        title: 'No Tasks Found',
        description: 'Please add some tasks on the dashboard first.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await generateStudyPlan({
        tasks: mockTasks,
        learningPreferences: preferences || 'No specific preferences provided.',
      });
      setResult(res);
      toast({
        title: 'Study Plan Generated!',
        description: 'Your new AI-powered study plan is ready.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate study plan.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="AI Study Plan"
        description="Let our AI craft the perfect study schedule for you."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Generate Your Plan</CardTitle>
            <CardDescription>
              Optionally add your learning preferences for a more personalized plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferences">Learning Preferences (Optional)</Label>
              <Textarea
                id="preferences"
                placeholder="e.g., I prefer studying in the morning, like using flashcards, and need short breaks every hour."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              />
            </div>
            <Button onClick={onSubmit} disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Study Plan
            </Button>
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
                    <Bot className="w-6 h-6 text-primary"/>
                    <CardTitle>Your Personalized Study Plan</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-stone dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: marked(result.studyPlan) }}
                />
              </CardContent>
            </Card>
          )}
           {!loading && !result && (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                <div className="text-center">
                    <p className="text-lg font-medium">Your study plan will appear here.</p>
                    <p className="text-sm text-muted-foreground">Click "Generate Study Plan" to start.</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
