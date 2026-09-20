import type { NextConfig } from "next";

// Baseline browser-side protections for every response. (A full Content-Security-Policy
// is still on the security checklist in SECURITY.md: it needs nonce support first.)
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Stops other sites framing the site or the admin panel (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  experimental: {
    serverActions: {
      // Career applications upload resumes (max 3 MB) through a Server Action.
      // Kept under Vercel's 4.5 MB request limit.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
