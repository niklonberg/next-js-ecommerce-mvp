import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";

type DashboardCardProps = {
  title: string;
  subtitle: string;
  content: string;
};

function DashboardCards({ title, subtitle, content }: DashboardCardProps) {
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

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCards
        title="Card One"
        subtitle="card description"
        content="this is the body text"
      />
    </div>
  );
}
