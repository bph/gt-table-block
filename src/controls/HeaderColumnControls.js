/**
 * HeaderColumnControls — PR 2
 *
 * Renders a single ToggleControl inside the Enhanced Table panel:
 *   - Style first column (hasHeaderColumn)
 *
 * CSS class applied to the <figure> wrapper (via the BlockListBlock filter
 * in with-extra-props.js and the save-side filter in with-save-props.js):
 *   has-header-column   — when hasHeaderColumn is true
 *
 * Styling lives in style.scss. Accessibility semantics (scope="row" on
 * first-column body/foot cells) are added in with-save-element.js — frontend
 * saved output only, not in the editor preview.
 *
 * No color picker for --gt-header-column-bg is exposed: themes can override
 * via CSS or theme.json, parallel to the PR 1 sticky-header background var.
 */

import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function HeaderColumnControls( { attributes, setAttributes } ) {
	const { hasHeaderColumn } = attributes;

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ __( 'Style first column as header', 'gt-table-block' ) }
			help={
				hasHeaderColumn
					? __(
							'First column is bold and gets scope="row" for screen readers.',
							'gt-table-block'
					  )
					: __( 'First column matches body cells.', 'gt-table-block' )
			}
			checked={ !! hasHeaderColumn }
			onChange={ ( value ) => setAttributes( { hasHeaderColumn: value } ) }
		/>
	);
}
