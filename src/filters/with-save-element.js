/**
 * getSaveElement filter — GT Table Block save-side modifications
 *
 * This filter is the only place we modify saved HTML output. Three PRs need it:
 *
 * PR 2 — Styled First Column (a11y)
 *   Adds scope="row" to the first <td> of each row inside <tbody> and <tfoot>.
 *   scope on a <td> isn't strictly HTML5, but every major screen reader honours
 *   it; converting to <th> would risk breaking core/table's block validation
 *   on edit round-trips. This is the editor-invisible, frontend-only path —
 *   the editor preview keeps the plain core rendering.
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
 * PR 1 needs no save-side changes — pure CSS via wrapper class.
 */

import { addFilter } from '@wordpress/hooks';
import { cloneElement, Children, isValidElement } from '@wordpress/element';

// Add scope="row" to the first <td> child of a <tr>.
function annotateRow( row ) {
	if ( ! isValidElement( row ) || row.type !== 'tr' ) {
		return row;
	}

	let firstCellSeen = false;
	const newChildren = Children.map( row.props.children, ( cell ) => {
		if ( ! isValidElement( cell ) || cell.type !== 'td' || firstCellSeen ) {
			return cell;
		}
		firstCellSeen = true;
		return cloneElement( cell, { scope: 'row' } );
	} );

	return cloneElement( row, {}, newChildren );
}

// Walk a <tbody> or <tfoot>, annotating each row's first cell.
function annotateSection( section ) {
	if ( ! isValidElement( section ) ) {
		return section;
	}
	const newChildren = Children.map( section.props.children, annotateRow );
	return cloneElement( section, {}, newChildren );
}

// Return a new <table> element with scope="row" on first body/foot cells.
function tableWithRowScopes( table ) {
	const newChildren = Children.map( table.props.children, ( child ) => {
		if ( isValidElement( child ) && ( child.type === 'tbody' || child.type === 'tfoot' ) ) {
			return annotateSection( child );
		}
		return child;
	} );
	return cloneElement( table, {}, newChildren );
}

addFilter(
	'blocks.getSaveElement',
	'gt-table-block/with-save-element',
	( element, blockType, attributes ) => {
		if ( blockType.name !== 'core/table' ) {
			return element;
		}

		const { hasHeaderColumn, stickyFirstColumn } = attributes;

		if ( ! hasHeaderColumn && ! stickyFirstColumn ) {
			return element;
		}

		// element is <figure>; its children include the <table> and optional <figcaption>.
		// Walk children once; transform the <table> in place.
		const newChildren = Children.map( element.props.children, ( child ) => {
			if ( ! isValidElement( child ) || child.type !== 'table' ) {
				return child;
			}

			let table = child;

			// PR 2: scope="row" on first body/foot cells.
			if ( hasHeaderColumn ) {
				table = tableWithRowScopes( table );
			}

			// PR 3: wrap table in scroll container.
			// The scroll wrapper sits inside the <figure> so theme `figure > table`
			// rules continue to apply (table is still a descendant of figure).
			if ( stickyFirstColumn ) {
				return (
					<div className="wp-block-table__scroll-container">
						{ table }
					</div>
				);
			}

			return table;
		} );

		// ── PR 4: Hidden cells (stub) ───────────────────────────────────────
		// Implement in PR 4 branch. Absorbed/merged cells will be marked
		// { hidden: true } in block attributes; this filter will skip rendering them.
		// colspan/rowspan on anchor cells will be output automatically because
		// they are already sourced attributes in core/table's block.json.

		return cloneElement( element, {}, newChildren );
	}
);
