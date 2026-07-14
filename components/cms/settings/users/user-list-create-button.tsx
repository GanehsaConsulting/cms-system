import { PlusIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface UserListCreateButtonProps {
  onClick: () => void;
}

export function UserListCreateButton({ onClick }: UserListCreateButtonProps) {
  return (
    <Button type="button" className="h-8 gap-1.5" onClick={onClick}>
      <PlusIcon className="size-3.5" />
      New User
    </Button>
  );
}
