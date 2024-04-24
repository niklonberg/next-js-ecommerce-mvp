import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
          <CardDescription>placeholder desc</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the card content!</p>
        </CardContent>
      </Card>
    </div>
  );
}
