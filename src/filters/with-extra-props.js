/**
 * BlockListBlock filter — applies feature classes and inline styles to the wrapper.
 *
 * The getSaveElement filter handles saved HTML. In the editor, block wrapper
 * classes are applied here via the `editor.BlockListBlock` filter so the editor
 * and frontend render identically.
 *
 * Classes added:
 *   has-sticky-header      (PR 1) — when stickyHeader is true
 *   has-header-column      (PR 2) — when hasHeaderColumn is true
 *   has-sticky-column      (PR 3) — when stickyFirstColumn is true
 *
 * Inline styles:
 *   --gt-sticky-header-offset: {n}px  (PR 1) — when stickyHeaderOffset > 0
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

const withGtTableWrapperProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if ( props.name !== 'core/table' ) {
			return <BlockListBlock { ...props } />;
		}

		const { stickyHeader, stickyHeaderOffset, hasHeaderColumn, stickyFirstColumn } =
			props.attributes;

		const extraClasses = [
			stickyHeader      ? 'has-sticky-header'  : '',
			hasHeaderColumn   ? 'has-header-column'   : '',
			stickyFirstColumn ? 'has-sticky-column'   : '',
		]
			.filter( Boolean )
			.join( ' ' );

		const extraStyle =
			stickyHeader && stickyHeaderOffset > 0
				? { '--gt-sticky-header-offset': `${ stickyHeaderOffset }px` }
				: {};

		return (
			<BlockListBlock
				{ ...props }
				className={ [ props.className, extraClasses ].filter( Boolean ).join( ' ' ) }
				wrapperProps={ {
					...props.wrapperProps,
					style: {
						...props.wrapperProps?.style,
						...extraStyle,
					},
				} }
			/>
		);
	};
}, 'withGtTableWrapperProps' );

addFilter(
	'editor.BlockListBlock',
	'gt-table-block/with-wrapper-props',
	withGtTableWrapperProps
);
