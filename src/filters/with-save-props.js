/**
 * blocks.getSaveContent.extraProps — add classes and inline styles to the
 * saved core/table wrapper (<figure>).
 *
 * Counterpart to with-extra-props.js, which only handles the editor DOM. Without
 * this filter the saved HTML doesn't include our feature classes, so sticky
 * header / first-column / sticky-column CSS never matches on the frontend.
 *
 * Classes added:
 *   has-sticky-header         (PR 1)
 *   has-first-column   (PR 2)
 *   has-sticky-column         (PR 3)
 *
 * Inline styles:
 *   --gt-sticky-header-offset:     (PR 1, when offset > 0)
 *   --gt-first-column-bg:   (PR 2, when colour picked)
 */

import { addFilter } from '@wordpress/hooks';

addFilter(
	'blocks.getSaveContent.extraProps',
	'gt-table-block/save-extra-props',
	( props, blockType, attributes ) => {
		if ( blockType.name !== 'core/table' ) {
			return props;
		}

		const {
			stickyHeader,
			stickyHeaderOffset,
			firstColumn,
			firstColumnBg,
			stickyFirstColumn,
		} = attributes;

		const extraClasses = [
			stickyHeader        ? 'has-sticky-header'        : '',
			firstColumn   ? 'has-first-column'  : '',
			stickyFirstColumn   ? 'has-sticky-column'        : '',
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

		const extraStyle = {};
		if ( stickyHeader && stickyHeaderOffset > 0 ) {
			extraStyle[ '--gt-sticky-header-offset' ] = `${ stickyHeaderOffset }px`;
		}
		if ( firstColumn && firstColumnBg ) {
			extraStyle[ '--gt-first-column-bg' ] = firstColumnBg;
		}

		if ( Object.keys( extraStyle ).length > 0 ) {
			next.style = { ...props.style, ...extraStyle };
		}

		return next;
	}
);
