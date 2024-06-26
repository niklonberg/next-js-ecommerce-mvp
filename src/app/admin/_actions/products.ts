"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function revalidateProducts() {
  revalidatePath("/");
  revalidatePath("/products");
}

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

export async function addProduct(_prevState: unknown, formData: FormData) {
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
      purchasable: false,
      name: newProduct.name,
      priceInCents: newProduct.priceInCents,
      description: newProduct.description,
      filePath,
      imagePath,
    },
  });

  revalidateProducts();

  redirect("/admin/products");
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProduct(
  id: string,
  _prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) return result.error.formErrors.fieldErrors;
  const newProduct = result.data;

  const productToEdit = await db.product.findUnique({ where: { id } });
  if (!productToEdit) return notFound();

  let filePath = productToEdit.filePath;
  if (newProduct.file != null && newProduct.file.size > 0) {
    await fs.unlink(productToEdit.filePath);
    filePath = `products/${crypto.randomUUID()}-${newProduct.file.name}`;
    await fs.writeFile(
      filePath,
      Buffer.from(await newProduct.file.arrayBuffer())
    );
  }

  let imagePath = productToEdit.imagePath;
  if (newProduct.image != null && newProduct.image.size > 0) {
    await fs.unlink(`public/${productToEdit.imagePath}`);
    imagePath = `/products/${crypto.randomUUID()}-${newProduct.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await newProduct.image.arrayBuffer())
    );
  }

  await db.product.update({
    where: { id },
    data: {
      name: newProduct.name,
      priceInCents: newProduct.priceInCents,
      description: newProduct.description,
      filePath,
      imagePath,
    },
  });

  revalidateProducts();

  redirect("/admin/products");
}

export async function toggleProductPurchasable(
  id: string,
  purchasable: boolean
) {
  await db.product.update({ where: { id }, data: { purchasable } });

  revalidateProducts();
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });
  if (!product) return notFound();

  await fs.unlink(product.filePath);
  await fs.unlink(`public${product.imagePath}`);

  revalidateProducts();
}
