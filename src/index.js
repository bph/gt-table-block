/**
 * GT Table Block — entry point
 *
 * Execution order matters here:
 * 1. Extend core/table attributes first (blocks.registerBlockType filter)
 *    so our custom attrs exist before the variation or edit filter reference them.
 * 2. Register the block variation.
 * 3. Register the BlockEdit filter (InspectorControls).
 * 4. Register the getSaveElement filter (DOM modifications for PR 3 + PR 4).
 */

import './filters/extend-attributes';         // PR 1-4: adds custom attrs to core/table
import './variation';                          // registers the Enhanced Table variation
import './filters/with-inspector-controls';   // PR 1-4: InspectorControls panel
import './filters/with-extra-props';          // PR 1-3: editor wrapper classes + styles
import './filters/with-save-props';           // PR 1-3: saved wrapper classes + styles (frontend)
import './filters/with-save-element';         // PR 3: scroll wrapper / PR 4: hidden cells

import './style.scss';                        // frontend + editor styles (loaded in iframe via enqueue_block_assets)
