"use client";

import { useEffect } from "react";

const STORAGE_KEY =
  "wedding_invite_token";

const COOKIE_MAX_AGE_SECONDS =
  60 * 60 * 24 * 730;

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

function getTokenFromCookie() {
  const cookiePrefix =
    `${STORAGE_KEY}=`;

  const cookie =
    document.cookie
      .split(";")
      .map((item) =>
        item.trim()
      )
      .find((item) =>
        item.startsWith(
          cookiePrefix
        )
      );

  if (!cookie) {
    return null;
  }

  const rawValue =
    cookie.slice(
      cookiePrefix.length
    );

  try {
    return decodeURIComponent(
      rawValue
    );
  } catch {
    return rawValue;
  }
}

function getLocalToken() {
  try {
    return localStorage.getItem(
      STORAGE_KEY
    );
  } catch {
    return null;
  }
}

function setSessionToken(
  token: string
) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      token
    );
  } catch {
    // O cookie ainda preserva o acesso.
  }
}

function setLocalToken(
  token: string
) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      token
    );
  } catch {
    // O cookie ainda preserva o acesso.
  }
}

function saveTokenCookie(
  token: string
) {
  try {
    const secureAttribute =
      window.location.protocol ===
      "https:"
        ? "; Secure"
        : "";

    document.cookie =
      [
        `${STORAGE_KEY}=${encodeURIComponent(token)}`,
        "Path=/",
        `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
        "SameSite=Lax",
      ].join("; ") +
      secureAttribute;
  } catch {
    // sessionStorage/localStorage continuam disponíveis.
  }
}

function saveToken(
  token: string
) {
  setSessionToken(token);
  setLocalToken(token);
  saveTokenCookie(token);
}

function restorePersistedToken() {
  const localToken =
    getLocalToken();

  const cookieToken =
    getTokenFromCookie();

  const persistedToken =
    localToken ||
    cookieToken;

  if (!persistedToken) {
    return;
  }

  setSessionToken(
    persistedToken
  );

  setLocalToken(
    persistedToken
  );

  if (!cookieToken) {
    saveTokenCookie(
      persistedToken
    );
  }
}

function syncInviteToken() {
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

  if (token) {
    saveToken(token);
    return;
  }

  restorePersistedToken();
}

export default function InviteTokenBridge() {
  useEffect(() => {
    syncInviteToken();
  }, []);

  return null;
}