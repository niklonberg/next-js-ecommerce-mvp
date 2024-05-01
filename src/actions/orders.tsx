"use server";

import db from "@/db/db";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY as string);
const emailSchema = z.string().email();

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"));

  if (!result.success) return { error: "Invalid email address" };

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
      orders: {
        select: {
          pricePaidInCents: true,
          id: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!user)
    return {
      message:
        "Check your email to view your order history and download your products.",
    };

  const orders = user.orders.map((order) => {
    return {
      ...order,
      downloadVerificationId: db.downloadVerification.create({
        data: {
          expiresAt: new Date(Date.now() + 24 * 1000 * 60 * 60 * 24),
          productId: order.product.id,
        },
      }),
    };
  });

  const data = await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmail />,
  });

  if (data.error)
    return {
      error: "There was an error sending your order history. Please try again.",
    };

  return {
    message:
      "Check your email to view your order history and download your products.",
  };
}
