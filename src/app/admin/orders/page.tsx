import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { formatCurrency, formatDateISO } from "@/lib/formatters";
import { MoreVertical } from "lucide-react";
import { PageHeader } from "../_components/PageHeader";

async function getOrders() {
  return await db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      createdAt: true,
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
  });
}

async function OrdersTable() {
  const orders = await getOrders();
  if (orders.length === 0) return <p>No orders found</p>;

  console.log(orders);
  return (
    <Table>
      <TableCaption>Current products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Purchase date</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Purchased by</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.product.name}</TableCell>
            <TableCell>{formatDateISO(order.createdAt)}</TableCell>
            <TableCell>
              {formatCurrency(order.pricePaidInCents / 100)}
            </TableCell>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropdownItem id={order.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function OrdersPage() {
  return (
    <>
      <PageHeader>Orders</PageHeader>
      <OrdersTable />
    </>
  );
}
