"use client";

import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Redirect() {
  const searchParams = useSearchParams();
  const link = searchParams.get("to");
  redirect(String(link));

  return <></>;
}

export default function ResirectSuspense() {
  return (
    <Suspense>
      <Redirect />
    </Suspense>
  );
}
