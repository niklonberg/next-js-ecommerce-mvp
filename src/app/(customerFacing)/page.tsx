import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { waitTest } from "@/lib/utils";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { purchasable: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}, ["/", "getNewestProducts"]);

const getPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { purchasable: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    });
  },
  ["/", "getPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

type ProductGridSectionProps = {
  productsFetcher: () => Promise<Product[]>;
  title: string;
};

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}

function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View all</span>
            <ArrowRight size={18} />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

export default function HomePage() {
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
