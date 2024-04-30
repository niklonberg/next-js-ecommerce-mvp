import db from "@/db/db";
import { PageHeader } from "../_components/PageHeader";

async function getUsers() {
  return await db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { pricePaidInCents: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function UsersTable() {}

export default function UsersPage() {
  return <PageHeader>Customers</PageHeader>;
}
