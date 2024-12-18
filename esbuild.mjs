import * as esbuild from "esbuild";
import { htmlPlugin } from "@craftamap/esbuild-plugin-html";

const options = {
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  metafile: true,
  sourcemap: true,
  outdir: "build/",
  loader: {
    ".svg": "dataurl",
  },
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: ["src/index.tsx"],
          filename: "index.html",
          htmlTemplate: `
<!DOCTYPE html>
<html lang="en" style="height: 100%">
<head>
  <title>Hometown Atlas by Kieran</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, interactive-widget=resizes-content">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css">
 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
</head>
<body style="height: 100%">
  <div id="root" style="height: 100%" />
</body>
</html>
          `,
        },
      ],
    }),
  ],
};

if (process.env.NODE_ENV === "dev") {
  const context = await esbuild
    .context(options)
    .catch((error) => console.log(error) && process.exit(1));
  await context.watch();
} else {
  await esbuild
    .build(options)
    .catch((error) => console.log(error) && process.exit(1));
}
