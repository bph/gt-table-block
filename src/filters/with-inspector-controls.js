/**
 * BlockEdit filter — GT Table Block InspectorControls
 *
 * Wraps core/table's edit component to inject our Settings panel.
 * Each PR's controls live in their own component in src/controls/ so they
 * can be developed and reviewed independently.
 *
 * PR 1: StickyHeaderControls   ← implemented
 * PR 2: HeaderColumnControls   ← stub, implement in PR 2 branch
 * PR 3: StickyColumnControls   ← stub, implement in PR 3 branch
 * PR 4: MergeCellsControls     ← stub, implement in PR 4 branch (toolbar, not panel)
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

import StickyHeaderControls from '../controls/StickyHeaderControls';
// PR 2: import HeaderColumnControls from '../controls/HeaderColumnControls';
// PR 3: import StickyColumnControls from '../controls/StickyColumnControls';

const withGtTableControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// Only inject controls for core/table.
		if ( props.name !== 'core/table' ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;

		return (
			<Fragment>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Enhanced Table', 'gt-table-block' ) }
						initialOpen={ true }
					>
						{ /* PR 1 */ }
						<StickyHeaderControls
							attributes={ attributes }
							setAttributes={ setAttributes }
						/>

						{ /* PR 2 — uncomment when branch is ready
						<HeaderColumnControls
							attributes={ attributes }
							setAttributes={ setAttributes }
						/>
						*/ }

						{ /* PR 3 — uncomment when branch is ready
						<StickyColumnControls
							attributes={ attributes }
							setAttributes={ setAttributes }
						/>
						*/ }
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withGtTableControls' );

addFilter(
	'editor.BlockEdit',
	'gt-table-block/with-inspector-controls',
	withGtTableControls
);
