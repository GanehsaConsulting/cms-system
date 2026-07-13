"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ArticleFormContentField } from "@/components/cms/articles/article-form-content-field";
import { ArticleFormDangerZone } from "@/components/cms/articles/article-form-danger-zone";
import {
  ArticleFormCharCounter,
  ArticleFormField,
} from "@/components/cms/articles/article-form-field";
import { ArticleFormHeader } from "@/components/cms/articles/article-form-header";
import { ArticleFormInfoPanel } from "@/components/cms/articles/article-form-info-panel";
import { ArticlePreviewDialog } from "@/components/cms/articles/article-preview-dialog";
import { ArticleFormPublishChecklist } from "@/components/cms/articles/article-form-publish-checklist";
import { ArticleFormPublicationPanel } from "@/components/cms/articles/article-form-publication-panel";
import { ArticleFormReadingStats } from "@/components/cms/articles/article-form-reading-stats";
import { ArticleFormSeoPanel } from "@/components/cms/articles/article-form-seo-panel";
import { ArticleFormSlugField } from "@/components/cms/articles/article-form-slug-field";
import { ArticleFormGalleryField } from "@/components/cms/articles/article-form-gallery-field";
import { ArticleFormThumbnailField } from "@/components/cms/articles/article-form-thumbnail-field";
import { CmsFormFieldGroup } from "@/components/shared/cms-form-field-group";
import { CmsFormSectionHeading } from "@/components/shared/cms-form-section-heading";
import { CmsPageShell } from "@/components/shared/cms-page-shell";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ARTICLE_FORM_LIMITS } from "@/config/article-form";
import { ARTICLE_ACTION_CONFIRMATIONS } from "@/config/article-actions";
import type { ArticleCategoryStyle } from "@/config/article-categories";
import {
  DEFAULT_ARTICLE_AUTHOR,
  resolveArticleAuthorName,
} from "@/config/article-authors";
import { RADIUS_DEEP } from "@/config/shape";
import { STACK_GAP } from "@/config/spacing";
import {
  createArticleAction,
  deleteArticleAction,
  updateArticleAction,
} from "@/lib/actions/articles";
import { getArticleFormChangedSections } from "@/lib/articles/form-changes";
import { slugifyArticleTitle } from "@/lib/articles/slug";
import {
  type ArticleFormValues,
  articleFormSchema,
} from "@/lib/validations/article";
import type { ArticlePreviewData } from "@/types/article-preview";
import type { Article, ArticleStatus } from "@/types/article";
import { cn } from "@/lib/utils";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

interface ArticleFormProps {
  article?: Article;
  categories: ArticleCategoryStyle[];
}

const defaultValues: ArticleFormValues = {
  title: "",
  excerpt: "",
  content: "<p></p>",
  status: "draft",
  authorName: DEFAULT_ARTICLE_AUTHOR,
  category: "general",
  tags: [],
  metaTitle: "",
  metaDescription: "",
  highlighted: false,
  thumbnail: "",
  gallery: [],
};

function articleToFormValues(article: Article): ArticleFormValues {
  return {
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    status: article.status,
    authorName: resolveArticleAuthorName(article.authorName),
    category: article.category,
    tags: article.tags,
    metaTitle: article.metaTitle,
    metaDescription: article.metaDescription,
    highlighted: article.highlighted,
    thumbnail: article.thumbnail ?? "",
    gallery: article.gallery,
  };
}

export function ArticleForm({ article, categories }: ArticleFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [availableCategories, setAvailableCategories] =
    useState<ArticleCategoryStyle[]>(categories);
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: article ? articleToFormValues(article) : defaultValues,
  });

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = form;

  const watchedValues = watch();
  const title = watchedValues.title;
  const excerpt = watchedValues.excerpt;
  const content = watchedValues.content;
  const category = watchedValues.category;
  const tags = watchedValues.tags;
  const metaTitle = watchedValues.metaTitle;
  const metaDescription = watchedValues.metaDescription;
  const authorName = watchedValues.authorName;

  const baselineValues = useMemo(
    () => (article ? articleToFormValues(article) : defaultValues),
    [article],
  );

  const changedSections = useMemo(
    () =>
      article
        ? getArticleFormChangedSections(baselineValues, watchedValues)
        : [],
    [article, baselineValues, watchedValues],
  );

  const hasUnsavedChanges =
    Boolean(article) && (isDirty || changedSections.length > 0);

  const derivedSlug = slugifyArticleTitle(title, ARTICLE_FORM_LIMITS.slug);

  const wordCountValues = useMemo(
    () => ({
      title,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      tags,
    }),
    [title, excerpt, content, metaTitle, metaDescription, tags],
  );

  const publishChecklistValues = useMemo(
    () => ({
      title,
      excerpt,
      content,
      category,
      authorName,
      tags,
      metaTitle,
      metaDescription,
    }),
    [
      title,
      excerpt,
      content,
      category,
      authorName,
      tags,
      metaTitle,
      metaDescription,
    ],
  );

  const previewArticle = useMemo<ArticlePreviewData>(
    () => ({
      title,
      excerpt,
      content,
      category,
      tags,
      authorName,
      slug: derivedSlug,
    }),
    [title, excerpt, content, category, tags, authorName, derivedSlug],
  );

  function buildFormData(values: ArticleFormValues) {
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("excerpt", values.excerpt);
    formData.set("content", values.content);
    formData.set("status", values.status);
    formData.set("authorName", values.authorName);
    formData.set("category", values.category);
    formData.set("tags", JSON.stringify(values.tags));
    formData.set("metaTitle", values.metaTitle);
    formData.set("metaDescription", values.metaDescription);
    formData.set("highlighted", String(values.highlighted));
    formData.set("thumbnail", values.thumbnail);
    formData.set("gallery", JSON.stringify(values.gallery));
    return formData;
  }

  function onSubmit(values: ArticleFormValues) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = article
        ? await updateArticleAction(article.id, buildFormData(values))
        : await createArticleAction(buildFormData(values));

      if (result && !result.success) {
        setError(result.error);
        return;
      }

      if (article) {
        setSuccess("Article saved successfully.");
        reset(values);
        router.refresh();
      }
    });
  }

  function submitWithStatus(status: ArticleStatus) {
    setValue("status", status, { shouldValidate: true, shouldDirty: true });
    void handleSubmit(onSubmit)();
  }

  function handleDelete() {
    if (!article) return;

    const confirmation = ARTICLE_ACTION_CONFIRMATIONS.delete(article.title);

    requestConfirm({
      ...confirmation,
      onConfirm: () => {
        setError(null);
        startTransition(async () => {
          const result = await deleteArticleAction(article.id);
          if (result && !result.success) {
            setError(result.error);
          }
        });
      },
    });
  }

  return (
    <>
      <CmsPageShell
        header={
          <ArticleFormHeader
            mode={article ? "edit" : "create"}
            articleTitle={title.trim() || article?.title}
            isPending={isPending}
            onPreview={() => setPreviewOpen(true)}
            onSaveDraft={() => submitWithStatus("draft")}
            onPublish={() => submitWithStatus("published")}
            onSetStatus={submitWithStatus}
          />
        }
      >
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_20rem]"
          >
            <div className={cn("flex flex-col", STACK_GAP)}>
              <SolidSurface className="space-y-6 p-4 md:p-5">
                <CmsFormSectionHeading
                  title="Article content"
                  description="Title, slug, excerpt, and body for the public article page."
                  accent="article"
                />

                <ArticleFormField
                  id="title"
                  label="Article Title"
                  required
                  counter={ArticleFormCharCounter({
                    current: title.length,
                    max: ARTICLE_FORM_LIMITS.title,
                  })}
                  error={errors.title?.message}
                >
                  <Input
                    id="title"
                    placeholder="Enter an interesting article title..."
                    aria-invalid={Boolean(errors.title)}
                    {...register("title")}
                  />
                </ArticleFormField>

                <ArticleFormSlugField title={title} />

                <ArticleFormField
                  id="excerpt"
                  label="Excerpt"
                  counter={ArticleFormCharCounter({
                    current: excerpt.length,
                    max: ARTICLE_FORM_LIMITS.excerpt,
                  })}
                  error={errors.excerpt?.message}
                >
                  <Textarea
                    id="excerpt"
                    rows={3}
                    placeholder="Write a short summary of the article to be displayed in the article list..."
                    aria-invalid={Boolean(errors.excerpt)}
                    className="resize-none"
                    {...register("excerpt")}
                  />
                </ArticleFormField>

                <Controller
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <ArticleFormContentField
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.content?.message}
                    />
                  )}
                />

                <CmsFormFieldGroup
                  title="Media"
                  description="Thumbnail and gallery images shown with the article."
                  accent="media"
                >
                  <ArticleFormThumbnailField
                    control={control}
                    error={errors.thumbnail?.message}
                  />
                  <ArticleFormGalleryField
                    control={control}
                    error={errors.gallery?.message}
                  />
                </CmsFormFieldGroup>
              </SolidSurface>
            </div>

            <aside className={cn("flex flex-col", STACK_GAP)}>
              <SolidSurface className="space-y-4 p-4">
                <ArticleFormInfoPanel
                  article={article}
                  slug={derivedSlug || article?.slug}
                  changedSections={changedSections}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
              </SolidSurface>

              <ArticleFormPublishChecklist values={publishChecklistValues} />
              <ArticleFormPublicationPanel
                control={control}
                tagsError={errors.tags?.message}
                categories={availableCategories}
                allowCreateCategory={!article}
                onCategoriesChange={setAvailableCategories}
                onCategoryCreated={(createdCategory) => {
                  setValue("category", createdCategory.id, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
              <ArticleFormSeoPanel
                metaTitle={metaTitle}
                metaDescription={metaDescription}
                metaTitleRegister={register("metaTitle")}
                metaDescriptionRegister={register("metaDescription")}
                metaTitleError={errors.metaTitle?.message}
                metaDescriptionError={errors.metaDescription?.message}
              />

              <ArticleFormReadingStats values={wordCountValues} />

              {article ? (
                <ArticleFormDangerZone
                  isPending={isPending}
                  onDelete={handleDelete}
                />
              ) : null}
            </aside>

            {error ? (
              <p
                className={cn(
                  RADIUS_DEEP,
                  "border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm xl:col-span-2",
                )}
              >
                {error}
              </p>
            ) : null}

            {success ? (
              <p
                className={cn(
                  RADIUS_DEEP,
                  "border border-border bg-muted px-3 py-2 text-muted-foreground text-sm xl:col-span-2",
                )}
              >
                {success}
              </p>
            ) : null}
          </form>
        </FormProvider>
      </CmsPageShell>

      <ArticlePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        article={previewArticle}
        publishedAt={article?.publishedAt ?? article?.updatedAt ?? undefined}
      />

      {confirmDialog}
    </>
  );
}
