import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LinkVault branded short-link analytics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#111217",
          color: "#f1f0eb",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          fontFamily: "Inter, Arial, sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 38, fontWeight: 800 }}>
          <div style={{ width: 54, height: 54, borderRadius: 12, background: "#ff6b4a" }} />
          LinkVault
        </div>
        <div style={{ fontSize: 82, fontWeight: 900, lineHeight: 1, marginTop: 48, maxWidth: 900 }}>
          Short links that prove which campaign worked.
        </div>
        <div style={{ color: "#a5acba", fontSize: 30, marginTop: 28 }}>
          Branded URLs, UTM hygiene, click analytics, and team-ready CRUD.
        </div>
      </div>
    ),
    size
  );
}
