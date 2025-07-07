'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';

import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  suggestLearningResources,
  type SuggestLearningResourcesOutput,
} from '@/ai/flows/suggest-learning-resources';
import { Loader2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const resourcesFormSchema = z.object({
  subject: z.string().min(2, {
    message: 'Subject must be at least 2 characters.',
  }),
  task: z.string().min(2, {
    message: 'Task must be at least 2 characters.',
  }),
});

export default function ResourcesPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] =
    React.useState<SuggestLearningResourcesOutput | null>(null);

  const form = useForm<z.infer<typeof resourcesFormSchema>>({
    resolver: zodResolver(resourcesFormSchema),
    defaultValues: {
      subject: '',
      task: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resourcesFormSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await suggestLearningResources(values);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate resource suggestions.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="Resource Suggestions"
        description="Find the best learning materials for any task, powered by AI."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Find Resources</CardTitle>
            <CardDescription>
              Tell us what you're working on, and we'll find helpful resources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Organic Chemistry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="task"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task / Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Understanding SN1 reactions" {...field} />
                      </FormControl>
                      <FormDescription>
                        Be specific for better results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Suggest Resources
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
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Suggested Resources</h2>
              {result.resources.map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-2">{resource.type}</Badge>
                        <CardTitle>{resource.title}</CardTitle>
                      </div>
                       <Button variant="ghost" size="icon" asChild>
                         <Link href={resource.url} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                         </Link>
                       </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{resource.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
           {!loading && !result && (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                <div className="text-center">
                    <p className="text-lg font-medium">Your resources will appear here.</p>
                    <p className="text-sm text-muted-foreground">Fill out the form to get started.</p>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}
