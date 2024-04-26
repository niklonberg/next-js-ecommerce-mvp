import { toggleProductPurchasable } from "@/app/admin/_actions/products";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";

export function ToggleDropdownItemPurchasable({
  id,
  purchasable,
}: {
  id: string;
  purchasable: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await toggleProductPurchasable(id, !purchasable);
        })
      }
    >
      {purchasable ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem() {}
