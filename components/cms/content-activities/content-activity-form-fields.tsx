"use client";

import dynamic from "next/dynamic";
import type { Control } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { ContentActivityFormImagesField } from "@/components/cms/content-activities/content-activity-form-images-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTENT_ACTIVITY_FORM_LIMITS } from "@/config/content-activity-form";
import { RADIUS_DEEP } from "@/config/shape";
import type { ContentActivityFormValues } from "@/lib/validations/content-activity";
import { cn } from "@/lib/utils";

const ArticleEditor = dynamic(
  () =>
    import("@/components/cms/article-editor").then((mod) => ({
      default: mod.ArticleEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="article-editor-wrapper min-h-50 rounded-md bg-muted/40"
        aria-hidden
      />
    ),
  },
);

interface ContentActivityFormFieldsProps {
  control: Control<ContentActivityFormValues>;
}

export function ContentActivityFormFields({
  control,
}: ContentActivityFormFieldsProps) {
  const kind = useWatch({ control, name: "kind" });
  const showTitle = useWatch({ control, name: "showTitle" });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-primary">
          Title
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        </Label>
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Input
                id="title"
                placeholder="Activity or promo title"
                maxLength={CONTENT_ACTIVITY_FORM_LIMITS.title}
                {...field}
              />
              {fieldState.error ? (
                <p className="text-destructive text-xs">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kind" className="text-primary">
          Type
        </Label>
        <Controller
          control={control}
          name="kind"
          render={({ field }) => (
            <Select
              value={field.value}
              items={[
                { value: "activity", label: "Activity" },
                { value: "promo", label: "Promo" },
              ]}
              onValueChange={field.onChange}
            >
              <SelectTrigger id="kind" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="promo">Promo</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Short excerpt</Label>
        <Controller
          control={control}
          name="excerpt"
          render={({ field }) => (
            <Textarea
              id="excerpt"
              rows={2}
              placeholder="Optional short summary"
              maxLength={CONTENT_ACTIVITY_FORM_LIMITS.excerpt}
              {...field}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-primary">
          Description
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        </Label>
        <Controller
          control={control}
          name="content"
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <ArticleEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Write the activity or promo description..."
              />
              {fieldState.error ? (
                <p className="text-destructive text-xs">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayAt" className="text-primary">
          Display date & time
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        </Label>
        <Controller
          control={control}
          name="displayAt"
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Input id="displayAt" type="datetime-local" {...field} />
              {fieldState.error ? (
                <p className="text-destructive text-xs">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <Controller
        control={control}
        name="showTitle"
        render={({ field }) => (
          <div
            className={cn(
              RADIUS_DEEP,
              "flex items-start gap-3 bg-primary/5 px-3 py-2.5",
            )}
          >
            <Checkbox
              id="showTitle"
              className="mt-0.5"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <div className="min-w-0 space-y-0.5">
              <Label htmlFor="showTitle">Show title on public site</Label>
              <p className="text-muted-foreground text-xs leading-relaxed">
                When enabled, a link URL is required for the card action.
              </p>
            </div>
          </div>
        )}
      />

      <div className="space-y-2">
        <Label htmlFor="linkUrl" className="text-primary">
          {kind === "promo" ? "Promo link" : "Instagram URL"}
          {showTitle ? (
            <span className="text-destructive" aria-hidden>
              {" "}
              *
            </span>
          ) : null}
        </Label>
        <Controller
          control={control}
          name="linkUrl"
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Input
                id="linkUrl"
                placeholder={
                  kind === "promo"
                    ? "https://example.com/promo"
                    : "https://instagram.com/p/..."
                }
                maxLength={CONTENT_ACTIVITY_FORM_LIMITS.linkUrl}
                {...field}
              />
              {fieldState.error ? (
                <p className="text-destructive text-xs">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <ContentActivityFormImagesField control={control} />
    </div>
  );
}
