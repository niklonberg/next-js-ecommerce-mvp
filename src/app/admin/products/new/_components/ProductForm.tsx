"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/formatters";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addProduct } from "@/app/admin/_actions/products";
import { useFormStatus } from "react-dom";

export function ProductForm() {
  const [priceInCents, setPriceInCents] = React.useState<number>(0);

  return (
    <form action={addProduct} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price in cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value))}
        />
      </div>
      <div className="text-muted-foreground">
        Price in USD: {formatCurrency((priceInCents || 0) / 100)}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input
          className="hover:cursor-pointer"
          type="file"
          id="file"
          name="file"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          className="hover:cursor-pointer"
          type="file"
          id="image"
          name="image"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
