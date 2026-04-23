/**
 * StickyHeaderControls — PR 1
 *
 * Renders two InspectorControls inside the Enhanced Table panel:
 *
 *  1. ToggleControl  — enable/disable the sticky header.
 *  2. NumberControl  — offset in pixels (shown only when sticky header is on).
 *     Sets --gt-sticky-header-offset on the <figure> via inline style so the
 *     correct top position survives themes with a fixed nav bar.
 *     Pattern borrowed from wpDataTables' "Header Offset" field.
 *
 * CSS classes applied to the <figure> wrapper (via the BlockListBlock filter
 * in with-extra-props.js, which reads these attrs and adds the class):
 *   has-sticky-header   — when stickyHeader is true
 *
 * The actual sticky CSS lives in style.scss and editor.scss.
 */

import { ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function StickyHeaderControls( { attributes, setAttributes } ) {
	const { stickyHeader, stickyHeaderOffset = 0 } = attributes;

	return (
		<>
			<ToggleControl
				label={ __( 'Sticky header row', 'gt-table-block' ) }
				help={
					stickyHeader
						? __( 'Header row stays visible while scrolling.', 'gt-table-block' )
						: __( 'Header row scrolls with the table.', 'gt-table-block' )
				}
				checked={ stickyHeader }
				onChange={ ( value ) => setAttributes( { stickyHeader: value } ) }
			/>

			{ stickyHeader && (
				<NumberControl
					label={ __( 'Sticky header offset (px)', 'gt-table-block' ) }
					help={ __(
						'Add an offset if your site has a fixed header or admin bar. Sets --gt-sticky-header-offset.',
						'gt-table-block'
					) }
					value={ stickyHeaderOffset }
					min={ 0 }
					max={ 500 }
					onChange={ ( value ) =>
						setAttributes( { stickyHeaderOffset: parseInt( value, 10 ) || 0 } )
					}
				/>
			) }
		</>
	);
}
