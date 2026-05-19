/**
 * FirstColumnControls — PR 2
 *
 * Renders the on/off toggle for the styled first column inside the Enhanced
 * Table panel (Settings tab). The colour picker for the column background
 * lives in src/controls/FirstColumnColor.js and contributes to the block's
 * Color tools panel under the Styles tab — that's where users expect to find
 * background colour controls.
 *
 * CSS class applied to the <figure> wrapper (via with-extra-props.js for the
 * editor and with-save-props.js for the saved output):
 *   has-first-column   — when firstColumn is true
 *
 * Styling lives in style.scss. Accessibility semantics (scope="row" on
 * first-column body/foot cells) are added in with-save-element.js — frontend
 * saved output only, not in the editor preview.
 */

import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function FirstColumnControls( { attributes, setAttributes } ) {
	const { firstColumn } = attributes;

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ __( 'Style first column', 'gt-table-block' ) }
			help={
				firstColumn
					? __(
							'First column is bold and gets scope="row" for screen readers.',
							'gt-table-block'
					  )
					: __( 'First column matches body cells.', 'gt-table-block' )
			}
			checked={ !! firstColumn }
			onChange={ ( value ) =>
				setAttributes( {
					firstColumn: value,
					// Clear the colour when disabling so we don't carry a dead style.
					...( ! value ? { firstColumnBg: '' } : {} ),
				} )
			}
		/>
	);
}
