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

async function getCustomerData() {
  const [customerCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    customerCount,
    averageSalesPerCustomer:
      customerCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / customerCount / 100,
  };
}

export default async function AdminDashboard() {
  const [salesData, customerData] = await Promise.all([
    getSalesData(),
    getCustomerData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} orders`}
        content={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(
          customerData.averageSalesPerCustomer
        )} Average sales per customer`}
        content={`${formatNumber(customerData.customerCount)} customers`}
      />
    </div>
  );
}
