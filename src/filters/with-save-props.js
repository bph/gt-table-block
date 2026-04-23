/**
 * blocks.getSaveContent.extraProps — add classes and inline styles to the
 * saved core/table wrapper (<figure>).
 *
 * Counterpart to with-extra-props.js, which only handles the editor DOM. Without
 * this filter the saved HTML doesn't include our feature classes, so sticky
 * header / header column / sticky column CSS never matches on the frontend.
 *
 * Classes added:
 *   has-sticky-header   (PR 1)
 *   has-header-column   (PR 2)
 *   has-sticky-column   (PR 3)
 *
 * Inline style:
 *   --gt-sticky-header-offset: {n}px   (PR 1, when offset > 0)
 */

import { addFilter } from '@wordpress/hooks';

addFilter(
	'blocks.getSaveContent.extraProps',
	'gt-table-block/save-extra-props',
	( props, blockType, attributes ) => {
		if ( blockType.name !== 'core/table' ) {
			return props;
		}

		const { stickyHeader, stickyHeaderOffset, hasHeaderColumn, stickyFirstColumn } =
			attributes;

		const extraClasses = [
			stickyHeader      ? 'has-sticky-header' : '',
			hasHeaderColumn   ? 'has-header-column' : '',
			stickyFirstColumn ? 'has-sticky-column' : '',
		]
			.filter( Boolean )
			.join( ' ' );

		if ( ! extraClasses ) {
			return props;
		}

		const next = {
			...props,
			className: [ props.className, extraClasses ].filter( Boolean ).join( ' ' ),
		};

		if ( stickyHeader && stickyHeaderOffset > 0 ) {
			next.style = {
				...props.style,
				'--gt-sticky-header-offset': `${ stickyHeaderOffset }px`,
			};
		}

		return next;
	}
);
