"use server";

import { z } from "zod";

const fileSchema = z.instanceof(File, { message: "File type is required" });

z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  description: z.string().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Filesize is too low"),
  image: fileSchema.refine((file) => file.size > 0, "Filesize is too low"),
});

export async function addProduct(formData: FormData) {
  console.log(formData);
}
