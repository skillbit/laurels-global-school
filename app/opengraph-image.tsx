import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The picture shown when the site is shared on WhatsApp, Facebook, Google, etc.
export const alt = "The Laurels Global School, CBSE school in Dehri-on-Sone, Bihar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The school's shield logo (public/logo.jpg), embedded in the picture.
const logo = `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "public/logo.jpg"))).toString("base64")}`;

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#7c1017", color: "#faf3e3", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "0 40px 0 80px" }}>
          <div style={{ display: "flex", width: 90, height: 6, background: "#e7c37a", marginBottom: 34 }} />
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>The Laurels</div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, color: "#f4b9bd" }}>Global School</div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 34, color: "#faf3e3" }}>CBSE school · Nursery to Class 10</div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 10, color: "#e7c37a" }}>Dehri-on-Sone, Rohtas, Bihar</div>
        </div>
        <div style={{ display: "flex", width: 470, alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", width: 400, height: 400, borderRadius: 200, background: "#ffffff", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={logo} width={320} height={320} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
