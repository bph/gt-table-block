/**
 * Extend core/table block attributes.
 *
 * We add our feature-flag attributes directly to the core/table block type
 * rather than only in the variation, so that:
 *  - The BlockEdit filter can read them via `attributes` without needing to
 *    check whether the variation is active.
 *  - Block serialisation round-trips them correctly from saved HTML comments.
 *
 * Attributes added here:
 *   PR 1: stickyHeader        {boolean}  — sticky thead on scroll
 *   PR 2: hasHeaderColumn     {boolean}  — style first column like a header
 *   PR 3: stickyFirstColumn   {boolean}  — sticky first column on horizontal scroll
 *
 * PR 4 (merge/unmerge) uses the existing colspan/rowspan attrs already present
 * in core/table's block.json, plus a `hidden` flag on cell objects which is
 * handled in the getSaveElement filter without a top-level block attribute.
 */

import { addFilter } from '@wordpress/hooks';

addFilter(
	'blocks.registerBlockType',
	'gt-table-block/extend-table-attributes',
	( settings, name ) => {
		if ( name !== 'core/table' ) {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,

				// PR 1 — sticky header row
				stickyHeader: {
					type: 'boolean',
					default: false,
				},

				// PR 1 — offset in px for sites with a fixed nav/admin bar
				stickyHeaderOffset: {
					type: 'integer',
					default: 0,
				},

				// PR 2 — styled first column
				hasHeaderColumn: {
					type: 'boolean',
					default: false,
				},

				// PR 3 — sticky first column (also triggers scroll wrapper in save)
				stickyFirstColumn: {
					type: 'boolean',
					default: false,
				},
			},
		};
	}
);
