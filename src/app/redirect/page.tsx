"use client";

import { redirect, useSearchParams } from "next/navigation";

export default function Redirect() {
  const searchParams = useSearchParams();
  const link = searchParams.get("to");
  redirect(String(link));
}
