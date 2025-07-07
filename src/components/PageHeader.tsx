import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
