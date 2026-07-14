"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
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
import { PORTFOLIO_WORK_TYPES } from "@/config/clients-works";
import { PORTFOLIO_FORM_LIMITS } from "@/config/portfolio-form";
import { RADIUS_DEEP } from "@/config/shape";
import type { PortfolioFormValues } from "@/lib/validations/portfolio";
import type { Client } from "@/types/client";
import { cn } from "@/lib/utils";

interface PortfolioFormFieldsProps {
  control: Control<PortfolioFormValues>;
  clients: Client[];
  hideClientField?: boolean;
}

export function PortfolioFormFields({
  control,
  clients,
  hideClientField = false,
}: PortfolioFormFieldsProps) {
  const descriptionId = hideClientField ? "work-description" : "description";
  const featuredId = hideClientField ? "work-featured" : "featured";

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
                placeholder="e.g. Brand website launch"
                maxLength={PORTFOLIO_FORM_LIMITS.title}
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

      {hideClientField ? null : (
        <div className="space-y-2">
          <Label htmlFor="clientId" className="text-primary">
            Client
            <span className="text-destructive" aria-hidden>
              {" "}
              *
            </span>
          </Label>
          <Controller
            control={control}
            name="clientId"
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="clientId" className="w-full">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error ? (
                  <p className="text-destructive text-xs">
                    {fieldState.error.message}
                  </p>
                ) : null}
                {clients.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    Create a client first before adding portfolio works.
                  </p>
                ) : null}
              </div>
            )}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="workType" className="text-primary">
          Work type
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        </Label>
        <Controller
          control={control}
          name="workType"
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="workType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PORTFOLIO_WORK_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <Label htmlFor="url">Project URL</Label>
        <Controller
          control={control}
          name="url"
          render={({ field }) => (
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              maxLength={PORTFOLIO_FORM_LIMITS.url}
              {...field}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={descriptionId}>Description</Label>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              id={descriptionId}
              rows={4}
              placeholder="Optional summary of the work."
              maxLength={PORTFOLIO_FORM_LIMITS.description}
              {...field}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="featured"
        render={({ field }) => (
          <div
            className={cn(
              RADIUS_DEEP,
              "flex items-start gap-3 bg-primary/5 px-3 py-2.5",
            )}
          >
            <Checkbox
              id={featuredId}
              className="mt-0.5"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <div className="min-w-0 space-y-0.5">
              <Label htmlFor={featuredId} className="font-medium text-sm">
                Featured work
              </Label>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Highlight this work on the public company profile.
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
