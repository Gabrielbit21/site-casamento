import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

const ICON_BACKGROUND = "#3f4635";

let monogramSource: string | null = null;

function getMonogramSource() {
  if (!monogramSource) {
    const content = readFileSync(
      join(
        process.cwd(),
        "public",
        "images",
        "monograma-gl-branco-site.png"
      ),
      "base64"
    );

    monogramSource =
      `data:image/png;base64,${content}`;
  }

  return monogramSource;
}

export function createPwaIcon(
  iconSize: number
) {
  const source =
    getMonogramSource();

  const monogramSize =
    Math.round(iconSize * 0.72);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            ICON_BACKGROUND,
        }}
      >
        <img
          src={source}
          alt=""
          width={monogramSize}
          height={monogramSize}
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    ),
    {
      width: iconSize,
      height: iconSize,
      headers: {
        "Cache-Control":
          "public, max-age=31536000, immutable",
      },
    }
  );
}