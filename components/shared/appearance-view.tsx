"use client";

import { AccentColorPicker } from "@/components/shared/accent-color-picker";
import { GlassBlurPicker } from "@/components/shared/glass-blur-picker";
import { ThemeModePicker } from "@/components/shared/theme-mode-picker";
import { WallpaperPicker } from "@/components/shared/wallpaper-picker";
import {
  SETTINGS_GROUP,
  SETTINGS_SECTION,
  SETTINGS_SECTION_FOOTER,
  SETTINGS_SECTION_LABEL,
} from "@/config/settings-layout";
import { STACK_GAP } from "@/config/spacing";
import { cn } from "@/lib/utils";

export function AppearanceView() {
  return (
    <div className={cn("flex flex-col", STACK_GAP)}>
      <section className={SETTINGS_SECTION}>
        <h2 className={SETTINGS_SECTION_LABEL}>Tampilan</h2>
        <div className={SETTINGS_GROUP}>
          <ThemeModePicker />
        </div>
        <p className={SETTINGS_SECTION_FOOTER}>
          Terang, gelap, atau ikuti preferensi sistem perangkat.
        </p>
      </section>

      <section className={SETTINGS_SECTION}>
        <h2 className={SETTINGS_SECTION_LABEL}>Warna aksen</h2>
        <div className={SETTINGS_GROUP}>
          <AccentColorPicker />
        </div>
        <p className={SETTINGS_SECTION_FOOTER}>
          Warna aksen Apple untuk tombol utama dan highlight UI.
        </p>
      </section>

      <section className={SETTINGS_SECTION}>
        <h2 className={SETTINGS_SECTION_LABEL}>Glass</h2>
        <div className={SETTINGS_GROUP}>
          <GlassBlurPicker />
        </div>
        <p className={SETTINGS_SECTION_FOOTER}>
          Atur intensitas blur dan transparansi panel glass.
        </p>
      </section>

      <section className={SETTINGS_SECTION}>
        <h2 className={SETTINGS_SECTION_LABEL}>Wallpaper</h2>
        <div className={SETTINGS_GROUP}>
          <WallpaperPicker />
        </div>
        <p className={SETTINGS_SECTION_FOOTER}>
          Pilih preset, upload gambar sendiri, atau atur mask untuk
          keterbacaan.
        </p>
      </section>
    </div>
  );
}
