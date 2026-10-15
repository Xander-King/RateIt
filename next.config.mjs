/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Topic icons can be SVGs (e.g. public/icons/movie-topic-icon.svg).
    // Next.js blocks SVG optimization by default since an untrusted SVG can
    // carry a <script>; we control what gets uploaded to Supabase storage,
    // so this is safe here, and the CSP still sandboxes anything embedded.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
