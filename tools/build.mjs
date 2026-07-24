/* =================================================================
   build.mjs — bundles src/*.jsx into a single minified dist/app.js.

   WHY: the site used to ship @babel/standalone (~3 MB) and transpile
   JSX in the browser on every visit. This precompiles it once so the
   browser downloads a small, minified bundle and loads React in its
   production build instead.

   HOW THE FILES TALK TO EACH OTHER: icons.jsx / covers.jsx / pages.jsx
   / cmdk.jsx / app.jsx don't use ES imports — they share globals
   (window.Icon, window.Cover, Object.assign(window, {...})). Several
   files also redeclare `const { useState } = React`, so we can't just
   concatenate them into one scope. We therefore transpile each file
   on its own and wrap it in an IIFE: collisions are avoided (each
   `const` is file-local) while the window.* assignments and bare
   cross-file references (Icon, Landing, …) still resolve at runtime.
   Load order is preserved, exactly like the old <script> tags.

   USAGE
     npm run build      one-off build
     npm run watch      rebuild on save (dev)

   After editing anything in src/*.jsx, run `npm run build` and commit
   the updated dist/app.js. Editing data.js needs NO rebuild — it is
   loaded directly by index.html.
   ================================================================= */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { transform } from 'esbuild';

// Load order matters — same as the old <script> tags in index.html.
const FILES = [
  'src/icons.jsx',
  'src/covers.jsx',
  'src/pages.jsx',
  'src/cmdk.jsx',
  'src/app.jsx',
];

const XFORM = {
  loader: 'jsx',
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  minify: true,
  target: 'es2019',
  legalComments: 'none',
};

export async function build() {
  const parts = [];
  for (const file of FILES) {
    const src = await readFile(file, 'utf8');
    const { code } = await transform(src, { ...XFORM, sourcefile: file });
    // IIFE wrapper keeps each file's top-level `const`s from colliding while
    // window.* exports + bare global references keep working across files.
    parts.push(`/* ${file} */\n(function(){\n${code}\n})();`);
  }
  const banner =
    '/* Bundled by tools/build.mjs — DO NOT EDIT. Edit src/*.jsx then run `npm run build`. */\n';
  await mkdir('dist', { recursive: true });
  await writeFile('dist/app.js', banner + parts.join('\n'));
  const bytes = (banner + parts.join('\n')).length;
  console.log(`✓ dist/app.js written (${(bytes / 1024).toFixed(1)} KB)`);
}

build().catch(err => { console.error(err); process.exit(1); });
