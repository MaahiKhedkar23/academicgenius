'use client';

import * as React from 'react';
import { PlusCircle, BookOpen, ChevronDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskForm } from '@/components/TaskForm';
import { PageHeader } from '@/components/PageHeader';
import type { Task, Subject } from '@/lib/types';
import { subjects, tasks as initialTasks } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [open, setOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const handleAddTask = (newTask: Task) => {
    setTasks((prevTasks) => {
      const existingIndex = prevTasks.findIndex((task) => task.id === newTask.id);
      if (existingIndex > -1) {
        const updatedTasks = [...prevTasks];
        updatedTasks[existingIndex] = newTask;
        return updatedTasks;
      }
      return [...prevTasks, { ...newTask, id: Date.now() }];
    });
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setOpen(true);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingTask(null);
    }
  };

  const getPriorityBadgeVariant = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader
        title="Dashboard"
        description="Here's what's on your plate. Stay organized and focused."
      >
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add a new task'}</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new task to your planner.
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              subjects={subjects}
              onSubmit={handleAddTask}
              setOpen={setOpen}
              taskToEdit={editingTask}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <div
                className={cn('w-12 h-12 rounded-lg flex items-center justify-center', subject.color)}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>
                  {tasks.filter((t) => t.subject === subject.name).length} tasks
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks
                    .filter((t) => t.subject === subject.name)
                    .slice(0, 4)
                    .map((task) => (
                      <TableRow key={task.id} onClick={() => handleEditTask(task)} className="cursor-pointer">
                        <TableCell className="font-medium">{task.description}</TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.deadline ? format(new Date(task.deadline), 'MMM d') : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
