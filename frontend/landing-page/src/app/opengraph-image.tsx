import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 90,
        background: "#123c4f",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          fontSize: 26,
          letterSpacing: 6,
          color: "#efb635",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        Independent school · Ages 5–18
      </div>
      <div style={{ fontSize: 104, fontWeight: 700, marginTop: 28, lineHeight: 1.05 }}>
        {siteConfig.name}
      </div>
      <div style={{ fontSize: 44, marginTop: 28, color: "#d6e0e3" }}>
        {siteConfig.tagline}
      </div>
    </div>,
    size,
  );
}
