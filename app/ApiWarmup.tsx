"use client";

import { useEffect } from "react";
import { warmupAPI } from "@/app/lib/api";

export default function ApiWarmup() {
  useEffect(() => {
    void warmupAPI().catch((error: unknown) => {
      console.warn("LMS API warmup failed", error);
    });
  }, []);

  return null;
}
