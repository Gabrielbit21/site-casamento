const MOMENT_CLIENT_KEY =
  "wedding_moments_client_key";

function createFallbackUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (character) => {
      const random =
        Math.floor(
          Math.random() * 16
        );

      const value =
        character === "x"
          ? random
          : (random & 0x3) |
            0x8;

      return value.toString(
        16
      );
    }
  );
}

export function createBrowserId() {
  const cryptoObject =
    globalThis.crypto;

  if (
    cryptoObject &&
    typeof cryptoObject.randomUUID ===
      "function"
  ) {
    return cryptoObject.randomUUID();
  }

  if (
    cryptoObject &&
    typeof cryptoObject.getRandomValues ===
      "function"
  ) {
    const bytes =
      new Uint8Array(16);

    cryptoObject.getRandomValues(
      bytes
    );

    bytes[6] =
      (bytes[6] & 0x0f) |
      0x40;

    bytes[8] =
      (bytes[8] & 0x3f) |
      0x80;

    const hex = Array.from(
      bytes,
      (byte) =>
        byte
          .toString(16)
          .padStart(2, "0")
    ).join("");

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join("-");
  }

  return createFallbackUuid();
}

export function getMomentClientKey() {
  if (
    typeof window ===
    "undefined"
  ) {
    return createBrowserId();
  }

  try {
    const stored =
      window.localStorage.getItem(
        MOMENT_CLIENT_KEY
      );

    if (
      stored &&
      stored.length >= 16
    ) {
      return stored;
    }

    const created =
      createBrowserId();

    window.localStorage.setItem(
      MOMENT_CLIENT_KEY,
      created
    );

    return created;
  } catch {
    return createBrowserId();
  }
}