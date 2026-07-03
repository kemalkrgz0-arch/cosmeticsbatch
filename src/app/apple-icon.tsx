import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          borderRadius: 40,
        }}
      >
        <svg width="104" height="104" viewBox="0 0 24 24" fill="#fff">
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="5" r="2.4" />
          <circle cx="12" cy="19" r="2.4" />
          <circle cx="5" cy="12" r="2.4" />
          <circle cx="19" cy="12" r="2.4" />
        </svg>
      </div>
    ),
    size,
  );
}
