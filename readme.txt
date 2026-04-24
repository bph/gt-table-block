=== GT Table Block ===
Contributors: bph
Tags: block, table, gutenberg, block-editor, block-variation
Requires at least: 6.6
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 0.1.1
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Sticky header row for the core Table block, delivered as an opt-in block variation that leaves existing tables untouched.

== Description ==

GT Table Block extends the built-in `core/table` block with optional features that compose cleanly — each feature is an independent toggle, not a block style, so any combination can be active on the same table.

**Available in this release:**

* **Sticky header row** — the `<thead>` row pins to the top of the viewport while the table body scrolls. Includes a numeric offset control for sites with a fixed admin bar or site header. Pure CSS at runtime (no frontend JavaScript). The sticky background is an opaque CSS variable with full theme.json customization support (see FAQ below).

**Planned for future releases:**

* Styled first column (header column) with `scope="row"` semantics — v0.2.0.
* Sticky first column for wide tables with horizontal scroll — v0.3.0.
* Merge / unmerge cells via a block toolbar control — v0.4.0.

= Why a variation, not a replacement block? =

The plugin deliberately extends `core/table` rather than forking it, so existing tables stay compatible with core as it evolves. Independent boolean attributes also let any combination of features be active at once — which block styles (a mutually exclusive radio group) cannot offer.

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/` or install via the Plugins screen.
2. Activate through the **Plugins** menu.
3. Insert the **Enhanced Table** variation from the block inserter, or convert an existing Table block via the Block Settings panel.

== Frequently Asked Questions ==

= Does it replace the core Table block? =

No. It registers a variation. Existing core Table blocks are unaffected until you enable a feature toggle on them.

= Does it need frontend JavaScript? =

No. Sticky header, header column styling, and sticky first column are pure CSS. Only the editor ships JS.

= Does it work with block themes? =

Yes. It targets `core/table` and uses the `wp-block-table` class chain for specificity without `!important`.

= How do I change the sticky header background color? =

The sticky header is painted with an opaque background so body rows don't show through it. It resolves in this order:

1. `--gt-sticky-header-bg` — a per-block or local override (wins over everything).
2. `--wp--custom--gt-sticky-header-bg` — a theme.json `settings.custom` value.
3. `Canvas` — the CSS system color (browser document background, adapts to light/dark mode).

**Theme-wide via theme.json (literal color):**

`{ "settings": { "custom": { "gtStickyHeaderBg": "#f5f5f5" } } }`

**Theme-wide via theme.json (reference a theme preset):**

`{ "settings": { "custom": { "gtStickyHeaderBg": "var(--wp--preset--color--base)" } } }`

The value is emitted into the CSS variable as-is, so any WP-generated preset works — `--wp--preset--color--accent`, `--wp--preset--color--contrast-2`, or any palette slug your theme registers.

In both cases WordPress serializes `settings.custom.gtStickyHeaderBg` as the CSS variable `--wp--custom--gt-sticky-header-bg`, which the plugin reads as a fallback.

**Theme-wide via raw CSS in theme.json:**

`{ "styles": { "css": ".wp-block-table.has-sticky-header { --gt-sticky-header-bg: var(--wp--preset--color--base); } " } }`

**Per-block override:** add an inline style or Additional CSS class that sets `--gt-sticky-header-bg` on the `<figure>`.

== Source code ==

Source code, build tools, issue tracker, and development log: https://github.com/bph/gt-table-block

The plugin is built with `@wordpress/scripts` (see the repository's README for build instructions). Each tagged release on GitHub corresponds to the stable tag published here.

== Changelog ==

= 0.1.1 =
* Documentation: shorter Short Description (Plugin Check 150-char limit), align GitHub README with readme.txt scope. No code changes.

= 0.1.0 =
* Initial release — sticky header row with optional offset control. Further features ship in subsequent releases.
