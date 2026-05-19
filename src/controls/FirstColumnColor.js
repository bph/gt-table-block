/**
 * FirstColumnColor — PR 2
 *
 * Contributes a "First column" colour item to the core Table block's existing
 * Color tools panel under the Styles tab, next to Text and Background. Only
 * appears when the firstColumn feature toggle (Settings tab) is enabled.
 *
 * Uses InspectorControls group="color" so the item lands inside the shared
 * Color ToolsPanel rather than spawning a separate panel. panelId is the
 * block's clientId — that's how the ToolsPanel groups items together.
 *
 * The selected colour is stored in the firstColumnBg attribute and emitted
 * as --gt-first-column-bg on the <figure> via with-extra-props /
 * with-save-props.
 */

import {
	InspectorControls,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function FirstColumnColor( { clientId, attributes, setAttributes } ) {
	const { firstColumn, firstColumnBg } = attributes;
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	if ( ! firstColumn ) {
		return null;
	}

	return (
		<InspectorControls group="color">
			<ColorGradientSettingsDropdown
				__experimentalIsRenderedInSidebar
				settings={ [
					{
						label: __( 'First column', 'gt-table-block' ),
						colorValue: firstColumnBg,
						onColorChange: ( value ) =>
							setAttributes( { firstColumnBg: value || '' } ),
						isShownByDefault: true,
						resetAllFilter: () => ( { firstColumnBg: '' } ),
						enableAlpha: true,
						clearable: true,
					},
				] }
				panelId={ clientId }
				{ ...colorGradientSettings }
			/>
		</InspectorControls>
	);
}
