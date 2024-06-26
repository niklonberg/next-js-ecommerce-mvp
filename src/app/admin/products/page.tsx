import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatDateISO } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  DeleteDropdownItem,
  ToggleDropdownItemPurchasable,
} from "./_components/ProductActions";

async function getProducts() {
  return await db.product.findMany({
    select: {
      id: true,
      purchasable: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { orders: true } },
      priceInCents: true,
    },
    orderBy: { name: "asc" },
  });
}

async function ProductsTable() {
  const products = await getProducts();
  if (products.length === 0) return <p>No products found</p>;

  return (
    <Table>
      <TableCaption>Current products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Available for purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.purchasable ? (
                <>
                  <CheckCircle2 className="stroke-green-700" />
                  <span className="sr-only">Purchasable</span>
                </>
              ) : (
                <>
                  <XCircle className="stroke-destructive" />
                  <span className="sr-only">Not purchasable</span>
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatDateISO(product.createdAt)}</TableCell>
            <TableCell>{formatDateISO(product.updatedAt)}</TableCell>
            <TableCell className="text-center">
              {product._count.orders}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(product.priceInCents / 100)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a download href={`/admin/products/${product.id}/download`}>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <ToggleDropdownItemPurchasable
                    id={product.id}
                    purchasable={product.purchasable}
                  />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem
                    id={product.id}
                    disabled={product._count.orders > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
}
