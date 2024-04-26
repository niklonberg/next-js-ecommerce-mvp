"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";

const fileSchema = z.instanceof(File, { message: "File type is required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  description: z.string().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Filesize is too low"),
  image: imageSchema.refine((file) => file.size > 0, "Filesize is too low"),
});

export async function addProduct(formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) return result.error.formErrors.fieldErrors;

  const newProduct = result.data;

  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${newProduct.file.name}`;
  await fs.writeFile(
    filePath,
    Buffer.from(await newProduct.file.arrayBuffer())
  );

  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${newProduct.image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await newProduct.image.arrayBuffer())
  );

  await db.product.create({
    data: {
      name: newProduct.name,
      priceInCents: newProduct.priceInCents,
      description: newProduct.description,
      filePath,
      imagePath,
    },
  });

  redirect("/admin/products");
}
