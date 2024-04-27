import db from "@/db/db";
import { Product } from "@prisma/client";

function getNewestProducts() {
  return db.product.findMany({
    where: { purchasable: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

function getPopularProducts() {
  return db.product.findMany({
    where: { purchasable: true },
    orderBy: { orders: { _count: "desc" } },
    take: 6,
  });
}

type ProductGridSectionProps = {
  productsFetcher: () => Promise<Product>[];
  title: string;
};

function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {}

export default function Home() {
  return (
    <main className="space-y-10">
      <ProductGridSection productsFetcher={getPopularProducts} />
      <ProductGridSection productsFetcher={getNewestProducts} />
    </main>
  );
}
