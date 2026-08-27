"use client";

import { useEffect } from "react";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

const STORAGE_KEY =
  "wedding_invite_token";

function getTokenFromPath(
  pathname: string
) {
  const match =
    pathname.match(
      /^\/convite\/([^/]+)/
    );

  if (!match?.[1]) {
    return null;
  }

  try {
    return decodeURIComponent(
      match[1]
    );
  } catch {
    return match[1];
  }
}

export default function InviteTokenBridge() {
  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  useEffect(() => {
    const queryToken =
      searchParams.get(
        "convite"
      );

    const pathToken =
      getTokenFromPath(
        pathname
      );

    const token =
      queryToken ||
      pathToken;

    if (!token) {
      return;
    }

    sessionStorage.setItem(
      STORAGE_KEY,
      token
    );
  }, [
    pathname,
    searchParams,
  ]);

  return null;
}