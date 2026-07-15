"use client";

import { BannerFormWhatsappPhoneField } from "@/components/cms/banners/banner-form-whatsapp-phone-field";
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
import { BANNER_LIMITS } from "@/config/banner";
import { WHATSAPP_MESSAGE_MAX } from "@/config/whatsapp";
import {
  buildWhatsAppUrl,
  isValidWhatsAppPhone,
} from "@/lib/prices/whatsapp";

export type BannerRedirectMode = "url" | "whatsapp";

interface BannerFormRedirectFieldProps {
  mode: BannerRedirectMode;
  redirectUrl: string;
  whatsappPhone: string;
  whatsappMessage: string;
  disabled?: boolean;
  onModeChange: (mode: BannerRedirectMode) => void;
  onRedirectUrlChange: (value: string) => void;
  onWhatsappPhoneChange: (value: string) => void;
  onWhatsappMessageChange: (value: string) => void;
}

export function BannerFormRedirectField({
  mode,
  redirectUrl,
  whatsappPhone,
  whatsappMessage,
  disabled = false,
  onModeChange,
  onRedirectUrlChange,
  onWhatsappPhoneChange,
  onWhatsappMessageChange,
}: BannerFormRedirectFieldProps) {
  const generatedLink =
    mode === "whatsapp"
      ? buildWhatsAppUrl(whatsappPhone, whatsappMessage)
      : "";

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="banner-redirect-mode">Redirect type</Label>
        <Select
          value={mode}
          items={[
            { value: "url", label: "Website URL / path" },
            { value: "whatsapp", label: "WhatsApp" },
          ]}
          disabled={disabled}
          onValueChange={(value) => {
            if (value === "url" || value === "whatsapp") {
              onModeChange(value);
            }
          }}
        >
          <SelectTrigger id="banner-redirect-mode" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="url">Website URL / path</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mode === "url" ? (
        <div className="space-y-2">
          <Label htmlFor="banner-redirect-url">Redirect link</Label>
          <Input
            id="banner-redirect-url"
            value={redirectUrl}
            onChange={(event) => onRedirectUrlChange(event.target.value)}
            placeholder="https://example.com or /contact"
            maxLength={BANNER_LIMITS.redirectUrl}
            disabled={disabled}
          />
          <p className="text-muted-foreground text-xs leading-relaxed">
            Open a page on your site or any external URL.
          </p>
        </div>
      ) : (
        <div className="space-y-3 rounded-(--radius-deep) border border-chart-2/25 bg-muted/40 p-3">
          <BannerFormWhatsappPhoneField
            value={whatsappPhone}
            disabled={disabled}
            onChange={onWhatsappPhoneChange}
          />

          <div className="space-y-2">
            <Label htmlFor="banner-whatsapp-message" className="text-chart-2">
              WhatsApp message
            </Label>
            <Textarea
              id="banner-whatsapp-message"
              rows={3}
              maxLength={WHATSAPP_MESSAGE_MAX}
              placeholder="Hi, I'm interested in learning more"
              className="resize-none"
              value={whatsappMessage}
              disabled={disabled}
              onChange={(event) => onWhatsappMessageChange(event.target.value)}
            />
            <p className="text-muted-foreground text-xs leading-relaxed">
              Optional prefilled chat text when the banner is tapped.
            </p>
            {generatedLink && isValidWhatsAppPhone(whatsappPhone) ? (
              <p className="break-all font-mono text-chart-2/80 text-[11px] leading-relaxed">
                {generatedLink}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
