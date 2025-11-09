"use client";

import { Navbar } from "@/components/navbar";
import type { ReactNode } from "react";

export function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
