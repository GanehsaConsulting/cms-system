import { PlusIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface BrandListCreateButtonProps {
  onClick: () => void;
}

export function BrandListCreateButton({ onClick }: BrandListCreateButtonProps) {
  return (
    <Button type="button" className="h-8 gap-1.5" onClick={onClick}>
      <PlusIcon className="size-3.5" />
      New Brand
    </Button>
  );
}
