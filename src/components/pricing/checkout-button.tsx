"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface CheckoutButtonProps {
  type: "college" | "highschool" | "standard" | "premium";
  children: ReactNode;
  className?: string;
}

export function CheckoutButton({ type, children, className = "" }: CheckoutButtonProps) {
  const handleClick = async () => {
    try {
      let endpoint = "";
      
      if (type === "college" || type === "highschool") {
        endpoint = `/api/checkout/create-session?type=${type}`;
      } else if (type === "standard" || type === "premium") {
        endpoint = `/api/checkout/create-subscription?plan=${type}`;
      }
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erreur lors de la création du checkout:", error);
    }
  };

  return (
    <Button 
      className={`w-full mb-6 ${className}`}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
