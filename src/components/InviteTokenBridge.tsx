"use client";

import { useEffect } from "react";

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

function saveTokenFromCurrentUrl() {
  const searchParams =
    new URLSearchParams(
      window.location.search
    );

  const queryToken =
    searchParams.get(
      "convite"
    );

  const pathToken =
    getTokenFromPath(
      window.location.pathname
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
}

export default function InviteTokenBridge() {
  useEffect(() => {
    saveTokenFromCurrentUrl();
  }, []);

  return null;
}