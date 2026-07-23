import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-border/40 flex-wrap gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
