import type { Task, Subject } from './types';

export const subjects: Subject[] = [
  { id: 1, name: 'Quantum Physics', color: 'bg-blue-500' },
  { id: 2, name: 'Organic Chemistry', color: 'bg-green-500' },
  { id: 3, name: 'World History', color: 'bg-yellow-500' },
  { id: 4, name: 'Calculus II', color: 'bg-red-500' },
  { id: 5, name: 'English Literature', color: 'bg-purple-500' },
];

export const tasks: Task[] = [
  {
    id: 1,
    subject: 'Quantum Physics',
    description: 'Solve problem set 3',
    deadline: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    priority: 'High',
  },
  {
    id: 2,
    subject: 'World History',
    description: 'Read chapter on the Renaissance',
    deadline: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    priority: 'Medium',
  },
  {
    id: 3,
    subject: 'Organic Chemistry',
    description: 'Prepare for lab session',
    deadline: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    priority: 'High',
  },
  {
    id: 4,
    subject: 'Calculus II',
    description: 'Review integration techniques',
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    priority: 'Low',
  },
   {
    id: 5,
    subject: 'Quantum Physics',
    description: 'Write up lab report',
    deadline: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    priority: 'Medium',
  },
];
