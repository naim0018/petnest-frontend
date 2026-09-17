"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

export function AddToCartButton({ productId }: { productId: string }) {
  const [inCart, setInCart] = useState(false);

  return (
    <PrimaryButton
      variant={inCart ? "secondary" : "primary"}
      size="sm"
      onClick={() => setInCart(!inCart)}
      leftIcon={inCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
      aria-label="Add to shopping cart"
    >
      {inCart ? "Added" : "Add"}
    </PrimaryButton>
  );
}
