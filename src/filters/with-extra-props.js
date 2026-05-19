/**
 * BlockListBlock filter — applies feature classes and inline styles to the wrapper.
 *
 * The getSaveElement / getSaveContent.extraProps filters handle saved HTML. In
 * the editor, block wrapper classes are applied here via the
 * `editor.BlockListBlock` filter so the editor and frontend render identically.
 *
 * Classes added:
 *   has-sticky-header   (PR 1) — when stickyHeader is true
 *   has-header-bg       (PR 1) — when headerBg is set
 *   has-first-column    (PR 2) — when firstColumn is true
 *   has-sticky-column   (PR 3) — when stickyFirstColumn is true
 *
 * Inline styles:
 *   --gt-sticky-header-offset:  (PR 1) when stickyHeaderOffset > 0
 *   --gt-header-bg:             (PR 1) when headerBg is set
 *   --gt-first-column-bg:       (PR 2) when firstColumnBg is set
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

const withGtTableWrapperProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		if ( props.name !== 'core/table' ) {
			return <BlockListBlock { ...props } />;
		}

		const {
			stickyHeader,
			stickyHeaderOffset,
			headerBg,
			firstColumn,
			firstColumnBg,
			stickyFirstColumn,
		} = props.attributes;

		// Pass through untouched when no Enhanced Table feature contributes.
		// Modifying wrapperProps/className unconditionally interferes with core
		// Table's own wrapper handling and prevents cells from rendering.
		const anyFeature =
			stickyHeader ||
			firstColumn ||
			stickyFirstColumn ||
			!! headerBg;
		if ( ! anyFeature ) {
			return <BlockListBlock { ...props } />;
		}

		const extraClasses = [
			stickyHeader      ? 'has-sticky-header' : '',
			headerBg          ? 'has-header-bg'     : '',
			firstColumn       ? 'has-first-column'  : '',
			stickyFirstColumn ? 'has-sticky-column' : '',
		]
			.filter( Boolean )
			.join( ' ' );

		const extraStyle = {};
		if ( stickyHeader && stickyHeaderOffset > 0 ) {
			extraStyle[ '--gt-sticky-header-offset' ] = `${ stickyHeaderOffset }px`;
		}
		if ( headerBg ) {
			extraStyle[ '--gt-header-bg' ] = headerBg;
		}
		if ( firstColumn && firstColumnBg ) {
			extraStyle[ '--gt-first-column-bg' ] = firstColumnBg;
		}

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
