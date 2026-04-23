/**
 * getSaveElement filter — GT Table Block save-side modifications
 *
 * This filter is the only place we modify saved HTML output. Two PRs need it:
 *
 * PR 3 — Sticky First Column
 *   Wraps the <table> in a scroll container div so overflow-x: auto works.
 *   position: sticky on td/th:first-child requires a scrollable ancestor;
 *   the core <figure class="wp-block-table"> wrapper does not provide this.
 *
 * PR 4 — Merge/Unmerge Cells
 *   Skips rendering cells marked { hidden: true } in block attributes.
 *   colspan/rowspan are already sourced attrs in core/table's block.json
 *   so no additional serialisation is needed for those.
 *
 * PR 1 and PR 2 need no save-side changes — their features are CSS-only,
 * applied via classes on the existing <figure> wrapper.
 */

import { addFilter } from '@wordpress/hooks';
import { cloneElement, Children } from '@wordpress/element';

addFilter(
	'blocks.getSaveElement',
	'gt-table-block/with-save-element',
	( element, blockType, attributes ) => {
		if ( blockType.name !== 'core/table' ) {
			return element;
		}

		const { stickyFirstColumn } = attributes;

		// ── PR 3: Scroll container ──────────────────────────────────────────
		// When stickyFirstColumn is active, wrap the table in a scrollable div
		// so that position: sticky; left: 0 on first-child cells works correctly.
		//
		// The wrapper sits inside the existing <figure> element so that core
		// figure > table CSS selectors in themes remain valid (the table is still
		// a descendant of figure, just one level deeper).
		if ( stickyFirstColumn ) {
			// element is <figure>; its children include the <table> and optional <figcaption>.
			const wrappedChildren = Children.map(
				element.props.children,
				( child ) => {
					if ( child?.type === 'table' ) {
						return (
							<div className="wp-block-table__scroll-container">
								{ child }
							</div>
						);
					}
					return child;
				}
			);

			return cloneElement( element, {}, wrappedChildren );
		}

		// ── PR 4: Hidden cells (stub) ───────────────────────────────────────
		// Implement in PR 4 branch. Absorbed/merged cells will be marked
		// { hidden: true } in block attributes; this filter will skip rendering them.
		// colspan/rowspan on anchor cells will be output automatically because
		// they are already sourced attributes in core/table's block.json.

		return element;
	}
);
