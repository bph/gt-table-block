/**
 * Register the Enhanced Table block variation.
 *
 * Important constraints (see PLAN.md — Known Gotchas):
 *  - Do NOT pre-populate head/body/foot in the variation attributes.
 *    Doing so breaks the core table creation wizard and the insert-row function.
 *  - Feature flags default to false so inserting the variation feels identical
 *    to inserting a plain core/table — features are opt-in per block instance.
 *
 * isActive receives the live block attributes and returns true when the block
 * is currently in "Enhanced Table" mode (i.e. at least one feature is enabled).
 * This drives the variation label in the block toolbar and List View.
 */

import { registerBlockVariation } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

registerBlockVariation( 'core/table', {
	name: 'gt-enhanced-table',
	title: __( 'Enhanced Table', 'gt-table-block' ),
	description: __(
		'Table with sticky header, styled first column, sticky first column, and cell merging.',
		'gt-table-block'
	),
	// No icon override — inherits core/table icon.
	// No scope override — appears in inserter and transforms.
	attributes: {
		// Feature flags only — no head/body pre-population.
		stickyHeader: false,
		hasHeaderColumn: false,
		stickyFirstColumn: false,
	},
	isActive: ( blockAttributes ) =>
		blockAttributes.stickyHeader ||
		blockAttributes.hasHeaderColumn ||
		blockAttributes.stickyFirstColumn,
} );
