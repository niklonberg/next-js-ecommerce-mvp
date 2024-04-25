import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

type DashboardCardProps = {
  title: string;
  subtitle: string;
  content: string;
};

function DashboardCard({ title, subtitle, content }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  );
}

async function getSalesData() {
  const salesData = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  const salesInDollars = (salesData._sum.pricePaidInCents || 0) / 100;

  return {
    amount: salesInDollars,
    numberOfSales: salesData._count,
  };
}

export default async function AdminDashboard() {
  const salesData = await getSalesData();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} orders`}
        content={formatCurrency(salesData.amount)}
      />
    </div>
  );
}
