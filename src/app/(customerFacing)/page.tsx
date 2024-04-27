import db from "@/db/db";

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

export default function Home() {
  return <h1>User homepage allan</h1>;
}
