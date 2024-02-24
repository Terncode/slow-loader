const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

esbuild.buildSync({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    sourcemap: false,
    minify: true,
    platform: "browser",
    outfile: "./public/index.js",
});


fs.copyFileSync(path.join(process.cwd(), "template.html"), path.join(process.cwd(), "public", "index.html"));
