import { ImageResponse } from "next/og";

// The picture shown when the site is shared on WhatsApp, Facebook, Google, etc.
export const alt = "The Laurels Global School, CBSE school in Dehri-on-Sone, Bihar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LEAVES: [number, number, number, number, number][] = [
  [112, 188, 9, 19, 15], [120, 165, 9.5, 20, 30], [131, 141, 10, 21, 46], [146, 119, 10, 21, 60], [165, 101, 9.5, 20, 74], [186, 90, 9, 19, 86],
  [108, 188, 9, 19, -15], [100, 165, 9.5, 20, -30], [89, 141, 10, 21, -46], [74, 119, 10, 21, -60], [55, 101, 9.5, 20, -74], [34, 90, 9, 19, -86],
];

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
          <div style={{ display: "flex", width: 380, height: 380, borderRadius: 190, background: "#fbf1e3", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="300" height="300" viewBox="0 0 220 220">
              <path d="M108,196 Q60,190 34,90" stroke="#a9782e" strokeWidth="3" fill="none" />
              <path d="M112,196 Q160,190 186,90" stroke="#a9782e" strokeWidth="3" fill="none" />
              {LEAVES.map(([cx, cy, rx, ry, rot]) => (
                <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill="#c81e2b" transform={`rotate(${rot} ${cx} ${cy})`} />
              ))}
            </svg>
            <div style={{ display: "flex", position: "absolute", top: 138, left: 0, right: 0, justifyContent: "center", fontSize: 46, fontWeight: 800, color: "#7c1017", letterSpacing: -1 }}>LGS</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
