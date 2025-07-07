export type Task = {
  id: number;
  subject: string;
  description: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
};

export type Subject = {
  id: number;
  name: string;
  color: string;
};
