import { CmsFormSectionHeading } from "@/components/shared/cms-form-section-heading";
import { cn } from "@/lib/utils";

interface CmsFormInfoPanelProps {
  /** ISO timestamps — omit when creating a new entity. */
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
  formatDate: (value: string) => string;
  changedSections: string[];
  hasUnsavedChanges: boolean;
  /** Copy when the entity has never been saved. */
  createHint: string;
  /** Reminder under the unsaved-changes list. */
  saveReminder: string;
  /** When edit mode is clean. */
  allSavedHint: string;
  /** When dirty but no section labels were detected. */
  genericDirtyHint: string;
}

export function CmsFormInfoPanel({
  createdAt,
  updatedAt,
  slug,
  formatDate,
  changedSections,
  hasUnsavedChanges,
  createHint,
  saveReminder,
  allSavedHint,
  genericDirtyHint,
}: CmsFormInfoPanelProps) {
  const isSavedEntity = Boolean(createdAt || updatedAt || slug);

  return (
    <div className="space-y-4">
      <CmsFormSectionHeading
        title="Information"
        description="Metadata and save status."
        accent="info"
      />

      {isSavedEntity ? (
        <dl className="space-y-3 text-sm">
          {updatedAt ? (
            <div className="space-y-1">
              <dt className="text-muted-foreground text-xs">Last updated</dt>
              <dd className="font-medium text-primary">
                {formatDate(updatedAt)}
              </dd>
            </div>
          ) : null}
          {createdAt ? (
            <div className="space-y-1">
              <dt className="text-muted-foreground text-xs">Created</dt>
              <dd>{formatDate(createdAt)}</dd>
            </div>
          ) : null}
          {slug ? (
            <div className="space-y-1">
              <dt className="text-muted-foreground text-xs">Slug</dt>
              <dd className="break-all font-mono text-muted-foreground text-xs">
                /{slug}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <p className="text-muted-foreground text-xs leading-relaxed">
          {createHint}
        </p>
      )}

      {hasUnsavedChanges ? (
        <div
          className={cn("space-y-2 rounded-lg bg-amber-500/10 px-3 py-2.5")}
          role="status"
        >
          <p className="font-medium text-amber-950 text-xs dark:text-amber-100">
            Unsaved changes
          </p>
          {changedSections.length > 0 ? (
            <ul className="list-disc space-y-0.5 pl-4 text-amber-900/90 text-xs dark:text-amber-100/90">
              {changedSections.map((section) => (
                <li key={section}>{section}</li>
              ))}
            </ul>
          ) : (
            <p className="text-amber-900/90 text-xs dark:text-amber-100/90">
              {genericDirtyHint}
            </p>
          )}
          <p className="text-amber-900/80 text-xs leading-relaxed dark:text-amber-100/80">
            {saveReminder}
          </p>
        </div>
      ) : isSavedEntity ? (
        <p className="text-muted-foreground text-xs leading-relaxed">
          {allSavedHint}
        </p>
      ) : null}
    </div>
  );
}
