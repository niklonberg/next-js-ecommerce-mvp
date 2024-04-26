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
import { formatCurrency } from "@/lib/formatters";

export default function AdminProducts() {
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

async function ProductsTable() {
  const products = await db.product.findMany({
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

  console.log(products);

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
                  <CheckCircle2 />
                  <span className="sr-only">Purchasable</span>
                </>
              ) : (
                <>
                  <XCircle />
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
              <MoreVertical />
              <span className="sr-only">Actions</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function formatDateISO(dateISO: Date) {
  return dateISO.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
