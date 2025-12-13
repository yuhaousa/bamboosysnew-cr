# Static site export

This folder is a plain static HTML/CSS/JS version of the site.

You can open `static/index.html` directly (no server required).

## Structure

- `index.html` and `*/index.html`: pages
- `assets/styles.css`: compiled CSS (Tailwind output)
- `assets/site.js`: shared JS (header/footer injection + small interactions)
- Images/icons are in the root of this folder (copied from `public/`).

## Preview locally

(Optional) You can also run a local static server:

Option A (Node):

```powershell
cd c:\development\bamboosysnew-cr
pnpm dlx http-server .\static -p 4173
```

Option B (Python):

```powershell
cd c:\development\bamboosysnew-cr\static
python -m http.server 4173
```

Then open `http://localhost:4173/`.
