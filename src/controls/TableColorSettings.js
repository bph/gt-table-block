/**
 * TableColorSettings — Enhanced Table colour items for the Styles tab
 *
 * Contributes additional items to the core Table block's existing Color tools
 * panel (Styles tab), alongside Text and Background. Each item appears as a
 * row in the same ToolsPanel so a single Reset-all clears them with core's
 * own colour attributes.
 *
 * Items:
 *   - Header        → headerBg       (PR 1) — always available
 *   - First column  → firstColumnBg  (PR 2) — only when firstColumn toggle is on
 *
 * Uses InspectorControls group="color" + __experimentalColorGradientSettingsDropdown.
 * panelId={ clientId } is what binds these items to the block's own Color
 * ToolsPanel instance (same panelId = same panel).
 *
 * Values are stored on the block attributes and emitted as CSS variables on
 * the saved <figure> by with-extra-props / with-save-props.
 */

import {
	InspectorControls,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function TableColorSettings( { clientId, attributes, setAttributes } ) {
	const { firstColumn, firstColumnBg, headerBg } = attributes;
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const settings = [
		{
			label: __( 'Header', 'gt-table-block' ),
			colorValue: headerBg,
			onColorChange: ( value ) =>
				setAttributes( { headerBg: value || '' } ),
			isShownByDefault: true,
			resetAllFilter: () => ( { headerBg: '' } ),
			enableAlpha: true,
			clearable: true,
		},
	];

	if ( firstColumn ) {
		settings.push( {
			label: __( 'First column', 'gt-table-block' ),
			colorValue: firstColumnBg,
			onColorChange: ( value ) =>
				setAttributes( { firstColumnBg: value || '' } ),
			isShownByDefault: true,
			resetAllFilter: () => ( { firstColumnBg: '' } ),
			enableAlpha: true,
			clearable: true,
		} );
	}

	return (
		<InspectorControls group="color">
			<ColorGradientSettingsDropdown
				__experimentalIsRenderedInSidebar
				settings={ settings }
				panelId={ clientId }
				{ ...colorGradientSettings }
			/>
		</InspectorControls>
	);
}
