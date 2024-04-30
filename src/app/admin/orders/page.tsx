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
  return await db.order.findMany({});
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
          <TableHead>Purchased</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>product name here</TableCell>
            <TableCell>{formatDateISO(order.createdAt)}</TableCell>
            <TableCell>
              {formatCurrency(order.pricePaidInCents / 100)}
            </TableCell>
            {/* <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent></DropdownMenuContent>
              </DropdownMenu>
            </TableCell> */}
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
