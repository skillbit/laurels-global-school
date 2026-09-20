import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Laurels Global School",
    short_name: "Laurels School",
    description: "CBSE school in Dehri-on-Sone, Rohtas, Bihar. Nursery to Class 10.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#c81e2b",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
