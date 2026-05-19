/**
 * FirstColumnHeaderControls — PR 2
 *
 * Renders inside the Enhanced Table InspectorControls panel:
 *   - ToggleControl for `firstColumnHeader`
 *   - ColorPalette for `firstColumnHeaderBg` (shown only when toggle is on)
 *
 * CSS class applied to the <figure> wrapper (via with-extra-props.js for the
 * editor and with-save-props.js for the saved output):
 *   has-first-column-header   — when firstColumnHeader is true
 *
 * Styling lives in style.scss. Accessibility semantics (scope="row" on
 * first-column body/foot cells) are added in with-save-element.js — frontend
 * saved output only, not in the editor preview.
 *
 * The colour is emitted as the CSS variable --gt-first-column-header-bg via
 * inline style on the figure, so it works in editor + frontend identically.
 */

import { ToggleControl, ColorPalette } from '@wordpress/components';
import { useSetting } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function FirstColumnHeaderControls( { attributes, setAttributes } ) {
	const { firstColumnHeader, firstColumnHeaderBg } = attributes;

	// Pull the active theme palette so the picker shows theme presets first.
	// useSetting falls back through theme.json layers; default to an empty array
	// when the theme exposes no palette (ColorPalette renders custom picker only).
	const themePalette = useSetting( 'color.palette' ) || [];

	return (
		<>
			<ToggleControl
				__nextHasNoMarginBottom
				label={ __( 'Style first column as header', 'gt-table-block' ) }
				help={
					firstColumnHeader
						? __(
								'First column is bold and gets scope="row" for screen readers.',
								'gt-table-block'
						  )
						: __( 'First column matches body cells.', 'gt-table-block' )
				}
				checked={ !! firstColumnHeader }
				onChange={ ( value ) =>
					setAttributes( {
						firstColumnHeader: value,
						// Clear the colour when disabling so we don't carry a dead style.
						...( ! value ? { firstColumnHeaderBg: '' } : {} ),
					} )
				}
			/>

			{ firstColumnHeader && (
				<div style={ { marginTop: '12px' } }>
					<p style={ { margin: '0 0 8px', fontWeight: 500 } }>
						{ __( 'First column background', 'gt-table-block' ) }
					</p>
					<ColorPalette
						value={ firstColumnHeaderBg }
						colors={ themePalette }
						onChange={ ( value ) =>
							setAttributes( { firstColumnHeaderBg: value || '' } )
						}
						enableAlpha
						clearable
					/>
				</div>
			) }
		</>
	);
}
