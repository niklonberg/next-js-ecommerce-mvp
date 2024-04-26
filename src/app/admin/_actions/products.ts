"use server";

import { z } from "zod";

z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  description: z.string().min(1),
});

export async function addProduct(formData: FormData) {
  console.log(formData);
}
