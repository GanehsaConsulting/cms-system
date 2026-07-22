"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => (
    <h1 className="border-(--separator) border-b pb-2 font-semibold text-xl tracking-tight first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 font-semibold text-lg tracking-tight first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 font-semibold text-base tracking-tight first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-foreground/90 text-sm leading-7">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary/80"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-7">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-7">
      {children}
    </ol>
  ),
  li: ({ children, className }) => (
    <li
      className={cn(
        "text-foreground/90",
        className?.includes("task-list-item") && "list-none -ml-5",
      )}
    >
      {children}
    </li>
  ),
  input: ({ checked, type }) => {
    if (type !== "checkbox") {
      return null;
    }

    return (
      <input
        type="checkbox"
        checked={Boolean(checked)}
        readOnly
        className="mr-2 accent-primary"
        aria-hidden
      />
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-(--separator) border-l-2 pl-4 text-muted-foreground text-sm leading-7">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-0 border-(--separator) border-t" />,
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-(--radius-deep) border border-(--separator)">
      <table className="w-full min-w-lg border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/60 text-xs uppercase tracking-wide">
      {children}
    </thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-(--separator)">{children}</tbody>,
  tr: ({ children }) => <tr className="align-top">{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2 font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-foreground/90 leading-6">{children}</td>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.includes("language-"));

    if (isBlock) {
      return (
        <code className={cn("font-mono text-[0.72rem] leading-relaxed", className)}>
          {children}
        </code>
      );
    }

    return (
      <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.8em] text-foreground">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-(--radius-deep) bg-muted/70 p-4">
      {children}
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
};

interface DocumentationMarkdownProps {
  markdown: string;
  className?: string;
}

export function DocumentationMarkdown({
  markdown,
  className,
}: DocumentationMarkdownProps) {
  return (
    <article
      className={cn(
        "max-w-none space-y-4 px-4 py-5 sm:px-6 sm:py-6 [&_h1+hr]:hidden [&_h2:first-child]:mt-0",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
