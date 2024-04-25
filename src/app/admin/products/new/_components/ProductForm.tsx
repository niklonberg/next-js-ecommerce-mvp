"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/formatters";

export function ProductForm() {
  const [priceInCents, setPriceInCents] = React.useState<number>();

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required></Input>
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price in cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
        ></Input>
      </div>
      <div className="text-muted-foreground">
        Price in USD: {formatCurrency((priceInCents || 0) / 100)}
      </div>
    </form>
  );
}
