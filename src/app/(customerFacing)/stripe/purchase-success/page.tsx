import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function createDownloadVerification(productId: string) {
  return (
    await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
      },
    })
  ).id;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );
  if (!paymentIntent.metadata.productId) return notFound();

  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });
  if (!product) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="max-w-5xl w-full mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">
        {isSuccess ? "Thank you for your purchase!" : "Purchase failed"}
      </h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
            sizes="33vw"
            priority={true}
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="line-clamp-4 text-muted-foreground">
            {product.description}
          </p>
          <Button className="mt-4" size="lg" asChild>
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerification(
                  product.id
                )}`}
              >
                Download
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
