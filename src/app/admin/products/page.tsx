import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";

export default function AdminProducts() {
  return (
    <div className="flex justify-between items-center gap-4">
      <PageHeader>Products</PageHeader>
      <Button>Add Product</Button>
    </div>
  );
}
