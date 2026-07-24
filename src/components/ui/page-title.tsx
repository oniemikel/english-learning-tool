import type { ReactNode } from 'react';

type PageTitleProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageTitle({ title, description, actions }: PageTitleProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:mb-7 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
