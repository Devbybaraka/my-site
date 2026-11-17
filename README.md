# my-site

A hand-built portfolio / landing page for Newton Baraka — product engineer.

Static HTML, CSS and vanilla JavaScript. No build step, no dependencies, no
framework: open `index.html` or serve the folder and it runs.

## Run it locally

```sh
python3 -m http.server 3000
# then open http://localhost:3000
```

Or any static server (`npx serve`, `bunx http-server`, GitHub Pages, Netlify,
Cloudflare Pages — all work as is).

## What's in here

| File | Purpose |
| --- | --- |
| `index.html` | All content and section structure |
| `styles.css` | Design tokens, dark/light themes, layout, motion |
| `script.js` | Theme toggle, menu, scroll reveals, counters, filters, form |
| `favicon.svg` | Monogram favicon |

## Make it yours

1. **Identity** — search `Newton Baraka` in `index.html` and the title/meta tags.
2. **Contact** — replace every `hello@devbybaraka.com` (also in `script.js`, in
   the mailto handler). The form validates and opens the visitor's mail client;
   it does not need a backend.
3. **Socials** — the GitHub link is real; update the LinkedIn URL or remove it.
4. **Work** — the six project cards are editable demo content: title,
   description, tags, metric and the `data-tags` value that drives the filters
   (`product`, `web`, `tooling`).
5. **Colours** — every colour, radius and easing lives in the `:root` block at
   the top of `styles.css`; the light theme is the `[data-theme='light']` block.
6. **Stats** — each `<span data-count="8">` controls one animated number.

## Accessibility & performance notes

- Semantic landmarks, a skip link, visible focus rings and labelled controls.
- `prefers-reduced-motion` disables the cursor, parallax and reveal animations.
- No images to download: all project artwork is CSS/SVG, so the page is a few
  tens of kilobytes before fonts.

## Deploy

Push to `main` and enable GitHub Pages for the repository root, or connect the
repo to Cloudflare Pages / Netlify with no build command and `/` as the output
directory.
