"use client";

import { MediaLibraryTableRow } from "@/components/cms/media/media-library-table-row";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { TableHead } from "@/components/ui/table";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { MediaAsset } from "@/types/media";

interface MediaLibraryTableProps {
  assets: MediaAsset[];
  onAssetSelect?: (asset: MediaAsset) => void;
}

export function MediaLibraryTable({ assets, onAssetSelect }: MediaLibraryTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>File</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Type</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Source</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Updated</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS} />
        </>
      }
    >
      {assets.map((asset) => (
        <MediaLibraryTableRow
          key={asset.id}
          asset={asset}
          onSelect={onAssetSelect}
        />
      ))}
    </CmsListTable>
  );
}
