"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

interface FreePlanButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function FreePlanButton({ href, children, className = "" }: FreePlanButtonProps) {
  return (
    <Link href={href}>
      <Button className={`w-full mb-6 ${className}`}>
        {children}
      </Button>
    </Link>
  );
}
