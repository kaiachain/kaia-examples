"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useLiff } from "../../context/LiffProvider";

export default function Page() {
  const { liffObject, loading, encodedUID } = useLiff();
  const router = useRouter();

  const friends = async (encodedUID: string, idToken: string) => {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invite/friends`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encodedUID,
          idToken,
        }),
      }
    ).then((res) => res.json());
    return;
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (encodedUID && liffObject && liffObject.isLoggedIn()) {
      friends(encodedUID as string, liffObject.getAccessToken() as string);
    }
    router.push("/square/surveys");
  }, [loading, encodedUID]);

  return <div className="flex flex-col gap-5"></div>;
}
