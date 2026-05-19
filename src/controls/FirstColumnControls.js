/**
 * FirstColumnControls — PR 2
 *
 * Renders inside the Enhanced Table InspectorControls panel:
 *   - ToggleControl for `firstColumn`
 *   - ColorPalette for `firstColumnBg` (shown only when toggle is on)
 *
 * CSS class applied to the <figure> wrapper (via with-extra-props.js for the
 * editor and with-save-props.js for the saved output):
 *   has-first-column   — when firstColumn is true
 *
 * Styling lives in style.scss. Accessibility semantics (scope="row" on
 * first-column body/foot cells) are added in with-save-element.js — frontend
 * saved output only, not in the editor preview.
 *
 * The colour is emitted as the CSS variable --gt-first-column-bg via
 * inline style on the figure, so it works in editor + frontend identically.
 */

import { ToggleControl, ColorPalette } from '@wordpress/components';
import { useSetting } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function FirstColumnControls( { attributes, setAttributes } ) {
	const { firstColumn, firstColumnBg } = attributes;

	// Pull the active theme palette so the picker shows theme presets first.
	// useSetting falls back through theme.json layers; default to an empty array
	// when the theme exposes no palette (ColorPalette renders custom picker only).
	const themePalette = useSetting( 'color.palette' ) || [];

	return (
		<>
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

			{ firstColumn && (
				<div style={ { marginTop: '12px' } }>
					<p style={ { margin: '0 0 8px', fontWeight: 500 } }>
						{ __( 'First column background', 'gt-table-block' ) }
					</p>
					<ColorPalette
						value={ firstColumnBg }
						colors={ themePalette }
						onChange={ ( value ) =>
							setAttributes( { firstColumnBg: value || '' } )
						}
						enableAlpha
						clearable
					/>
				</div>
			) }
		</>
	);
}
