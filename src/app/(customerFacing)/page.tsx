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
  productsFetcher: () => Promise<Product[]>;
  title: string;
};

function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="space-y-10">
      <ProductGridSection
        productsFetcher={getPopularProducts}
        title="Most popular"
      />
      <ProductGridSection productsFetcher={getNewestProducts} title="Newest" />
    </main>
  );
}
