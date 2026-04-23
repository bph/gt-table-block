=== GT Table Block ===
Contributors: bph
Tags: block, table, gutenberg, block-editor, block-variation
Requires at least: 6.6
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 0.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Enhances the core Table block with sticky header, styled first column, sticky first column, and cell merging — as a block variation with composable toggles.

== Description ==

GT Table Block registers a block variation of `core/table` that adds four composable features without forking the block:

* **Sticky header row** — header stays visible while the table body scrolls.
* **Styled first column** — semantic `scope="row"` plus header-style treatment.
* **Sticky first column** — first column stays visible during horizontal scroll.
* **Merge / unmerge cells** — `colspan` / `rowspan` via toolbar controls.

All features are independent toggles. Any combination can be active on the same table.

= Why a variation, not a replacement block? =

The plugin deliberately extends `core/table` rather than forking it, so tables stay compatible with core as it evolves. Independent boolean attributes also let any combination of features be active — which block styles (a mutually exclusive radio group) cannot offer.

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

**Theme-wide via theme.json:**

`{ "settings": { "custom": { "gtStickyHeaderBg": "#f5f5f5" } } }`

WordPress serializes `settings.custom.gtStickyHeaderBg` as the CSS variable `--wp--custom--gt-sticky-header-bg`, which the plugin reads as a fallback.

**Theme-wide via raw CSS in theme.json:**

`{ "styles": { "css": ".wp-block-table.has-sticky-header { --gt-sticky-header-bg: var(--wp--preset--color--base); } " } }`

**Per-block override:** add an inline style or Additional CSS class that sets `--gt-sticky-header-bg` on the `<figure>`.

== Changelog ==

= 0.1.0 =
* Initial release — sticky header row (PR 1). Further features ship in subsequent releases.
