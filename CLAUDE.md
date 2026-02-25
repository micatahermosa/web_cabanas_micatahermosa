# How I Design

I make websites that look like nothing else on the web. Not because of gimmicks, but because I care about the same things book designers have cared about for centuries: typography, space, hierarchy, and rhythm.

## Session Workflow

At the start of every working session, before doing anything else:
1. Read `assets/css/variables.css`, `assets/css/layout.css`, `assets/css/typography.css`, and `assets/css/styles.css`
2. These are the source of truth — don't invent what already exists

**HTML first.** Write HTML using existing classes. Only after the structure is in
place, decide whether any new CSS is actually needed.

**Default: no new CSS.** Before writing any new rule, explicitly check whether
the existing system already handles it. Most new sections need HTML only —
grid compositions, typography classes, and spacing utilities cover the structure.
New CSS belongs in `styles.css` for section backgrounds, project-specific component
styles, and overrides that require project-specific variable values. If you're about
to write a rule that mirrors something in `layout.css` or `typography.css`, stop —
use the existing class instead.


## What I Reject

The "wordpressization" of the web — that sameness where every site has a 960px centered container, the same hero-cards-CTA-footer pattern, the same bland spacing, the same generic grid. My sites should feel authored, not assembled from a template.

- No arbitrary max-widths on sections (no `960px`, no `1200px`). Sections fill the viewport. Content is constrained by measure (`ch`), not pixels.
- No `.container` wrapper `<div>`s. The `<section>` IS the grid container.
- No frameworks (CSS or JS). No Tailwind, Bootstrap, React, jQuery.
- No Google Fonts CDN. Local `@font-face`, WOFF2 only, `font-display: swap`.
- No utility-class systems. A handful (`.visually-hidden`) is fine; `.tracking-tight .text-balance .bold` is a system — don't build one.
- No decorative clutter. Every element earns its place.
- No card borders or box styling. Cards are content blocks — spacing and typography create hierarchy, not borders and shadows.

## Typography Thinking

Typography IS the design. These principles are non-negotiable:

- **Optical line-height**: The single most important rule. Large display text needs tight leading (~1.0). Section titles need slightly more (~1.1). Body text needs open leading (~1.6). Never apply the same `line-height` across sizes.
- **Measure**: Body text sits at 60–75ch. Never wider. This comes from centuries of book typography. Use `ch` units, not pixels.
- **No orphans**: `text-wrap: balance` on headings. `text-wrap: pretty` on body text.
- **Hierarchy through space**: The space BEFORE a heading must be larger than the space AFTER it (proximity principle — a heading belongs to the content that follows). Spacing hierarchy is as important as font hierarchy.
- **Semantic sizing classes**: Never put `font-size` on `h1`–`h6` directly. Use visual classes (`.site-title`, `.title`, `.subtitle`, `.card-title`, `.label`) to decouple document hierarchy from visual size.
- **Letter-spacing tightens as size increases.** Display text gets negative tracking (`-0.03em`). Body text gets none.
- **Two-font system**: One display, one body. The contrast between them creates character.
- **All font sizes are fluid** with `clamp()`. The relationship between sizes matters more than the exact values.

## Layout Thinking

- **Sections fill the viewport width.** The grid's outer columns (`minmax(gutter, 1fr)`) handle edge spacing — they grow on wide screens, giving content room without capping section width.
- **Grid directly on `<section>`**. 7 columns: gutter + 5 content + gutter. No wrappers. Children are placed on the grid.
- **Composable classes**: `.edge-right` / `.edge-left` for horizontal bleed (image to viewport edge). `.bleed` for vertical bleed (removes section padding). Combine them: `.edge-right.bleed` for full bleed. Use independently or together.
- **Facing-center columns**: In split layouts, `col-a` text-aligns right and `col-b` text-aligns left — content faces the center gap. Resets to left-aligned when stacked.
- **Dual stacking system**: Container queries style children (column placement, text alignment). `@media` styles the section itself (padding, overflow) — CSS spec limitation: containers can't query themselves. Both trigger at the same `rem` breakpoint.
- **Intrinsic design**: `minmax()`, `auto-fit`/`auto-fill` for card grids. Let content dictate layout, not arbitrary breakpoints.
- **Generous negative space**. More space is almost always better. Let content breathe.
- **Fluid spacing** with `clamp()`: the `--space-*` scale adapts to the viewport.

## CSS Philosophy

- Hand-written modern CSS. No preprocessors, no build tools (unless 11ty for multi-page).
- Flat selectors — max 2 levels of nesting. Native CSS nesting OK for simple parent-child.
- Element selectors for base styles; classes for components. IDs only for anchors and JS hooks.
- Custom properties at `:root` for colors, fonts, spacing.
- Minimal code. The shortest solution that works is the right one.
- Use modern CSS: `:has()`, `:is()`, `:where()`, `color-mix()`, `@supports`, `accent-color`.

## HTML

- Semantic HTML5: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`.
- Proper heading hierarchy (decoupled from visual size via classes).
- Accessibility: `lang` attribute, ARIA where needed, `:focus-visible`, skip links.
- Native elements first: `<dialog>`, `<details>`, `<picture>`.
- Images: `<picture>` with WebP + fallback, `loading="lazy"`, `width`/`height` attributes.
- **Title placement**: In split layouts (`.three-two`, `.two-three`, `.halves`), titles are standalone section children — they span the full content area with consistent grid-row spacing. In edge layouts (`.edge-right`, `.edge-left`), titles go inside the text column since the other column bleeds to the viewport edge.

## JavaScript

- Vanilla JS only. Progressive enhancement — site works without it.
- Common uses: menu toggle, email obfuscation (base64), GLightbox for galleries.
- `defer` on script tags. Before writing JS, verify CSS/HTML can't do it natively.

## The Starter Kit

The `starter/` folder contains CSS I reuse across projects:

- **`reset.css`** — Modern CSS reset
- **`typography.css`** — Type scale, optical line-heights, semantic classes, measure, vertical rhythm
- **`layout.css`** — Grid foundation, compositions, stacking, flow spacing, image utilities

They define patterns through actual code. Extend them in project CSS — never duplicate or contradict them.

These files expect project-level custom properties. Font and color values are project-specific — only the variable names and the spacing scale are fixed:
```css
:root {
  --font-body:    /* project body typeface */;
  --font-display: /* project heading/display typeface */;
  --font-ui:      system-ui, sans-serif;
  --color-text:   /* project foreground */;
  --color-bg:     /* project background */;
  /* ... other variables ... */
  --space-xs: clamp(0.25rem, 0.5vw, 0.5rem);
  --space-sm: clamp(0.5rem, 1vw, 0.75rem);
  --space-md: clamp(1rem, 2vw, 1.5rem);
  --space-lg: clamp(1.5rem, 3vw, 2.5rem);
  --space-xl: clamp(2.5rem, 5vw, 4.5rem);
  --space-2xl: clamp(4rem, 8vw, 7rem);
}
```

## Fonts (pick a pair per project)

Always ask: "What two typefaces will define this project?" The choice of fonts sets the tone and character of the entire design. Choose carefully. But fonts Ive found myself returning to over and over again:
Jost, Open Sans, Raleway
Besley, Bodoni, Goudy Bookletter 1911, Cooper
Ostrich Sans, Marauder
**Inclusive:** Adelphe, Baskervvol, Homoneta, DINdong

## Project Structure

```
project/
  CLAUDE.md
  README.md
  styleguide/ (sometimes I'll put screenshots of design refs, fonts I want to test for the project, etc)
  www/
      assets/
        css/
          styles.css        (imports + project styles)
          variables.css     (project custom properties: colors, fonts)
          reset.css         (from kit)
          typography.css    (from kit)
          layout.css        (from kit)
          fontface.css      (project-specific)
          glightbox.min.css (when website needs a gallery)
        fonts/
        imgs/               (UI: icons, backgrounds)
        js/scripts.js
      images/               (content: photos, illustrations)
      index.html
```
