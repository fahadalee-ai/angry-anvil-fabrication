import fs from "node:fs";
import path from "node:path";
import type { Connect, Plugin } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/** Public URL path (trailing slash). Must match Nginx `location` and `PREVIEW_URL` in preview.html. */
const PRODUCTION_BASE = "/angry-anvil-fabrication/";

/** Vercel serves the app at the domain root and needs Nitro's Build Output. */
const onVercel = process.env.VERCEL === "1";

/** Serve the phone frame before the app router, at both the site root and the subpath. */
function servePreviewHtml(): Plugin {
  const file = path.resolve("public/preview.html");
  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const pathname = (req.url ?? "").split("?")[0];
    if (pathname !== "/preview.html" && pathname !== "/angry-anvil-fabrication/preview.html") return next();
    if (!fs.existsSync(file)) return next();
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    fs.createReadStream(file).pipe(res);
  };
  return {
    name: "serve-preview-html",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  nitro: onVercel ? { preset: "vercel" } : false,
  plugins: [servePreviewHtml()],
  vite: {
    // Subpath must match Nginx and preview.html; use this for dev/preview/build so PM2 `vite preview` matches assets.
    // Vercel has no subpath, so the same build is served at /.
    base: onVercel ? "/" : PRODUCTION_BASE,
    // Allow the domain to access the preview server (if needed for SSR testing)
    server: {
        allowedHosts: [
            "demo.sourapps.com",
            "localhost",
            "127.0.0.1",
        ],
    },
    preview: {
        allowedHosts: [
            "demo.sourapps.com",
            "localhost",
            "127.0.0.1",
        ],
    },
  },
});