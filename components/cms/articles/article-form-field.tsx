import { cn } from "@/lib/utils";

interface ArticleFormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  counter?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function ArticleFormField({
  id,
  label,
  required = false,
  hint,
  counter,
  error,
  children,
  className,
}: ArticleFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start justify-between gap-3">
        <label htmlFor={id} className="font-medium text-sm">
          {label}
          {required ? (
            <span className="text-destructive" aria-hidden>
              {" "}
              *
            </span>
          ) : null}
        </label>
        {counter ? (
          <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
            {counter}
          </span>
        ) : null}
      </div>
      {children}
      {hint ? (
        <p className="text-muted-foreground text-xs leading-relaxed">{hint}</p>
      ) : null}
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}

export function ArticleFormCharCounter({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  return `${current} / ${max}`;
}
