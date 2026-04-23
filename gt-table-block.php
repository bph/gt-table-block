<?php
/**
 * Plugin Name:       GT Table Block
 * Plugin URI:        https://github.com/bph/gt-table-block
 * Description:       Enhances the core Table block with sticky header, styled first column, sticky first column, and cell merging — as a block variation with composable toggles.
 * Version:           0.1.0
 * Requires at least: 6.6
 * Requires PHP:      7.4
 * Author:            Birgit Pauli-Haack
 * Author URI:        https://gutenbergtimes.com/table-block
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gt-table-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue editor assets.
 *
 * Loads the block variation registration, attribute extensions, and
 * InspectorControls filters into the block editor, plus editor-only style
 * overrides from src/editor.scss.
 */
function gt_table_block_editor_assets(): void {
	$asset_file = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'gt-table-block-editor',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_enqueue_style(
		'gt-table-block-editor',
		plugin_dir_url( __FILE__ ) . 'build/index.css',
		[ 'wp-edit-blocks' ],
		$asset['version']
	);
}
add_action( 'enqueue_block_editor_assets', 'gt_table_block_editor_assets' );

/**
 * Enqueue frontend + editor styles.
 *
 * src/style.scss is auto-extracted by @wordpress/scripts into style-index.css.
 * enqueue_block_assets fires in both editor and frontend contexts, so sticky
 * header / sticky column / header column styles work everywhere.
 */
function gt_table_block_frontend_assets(): void {
	$asset_file = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_style(
		'gt-table-block',
		plugin_dir_url( __FILE__ ) . 'build/style-index.css',
		[ 'wp-block-table' ],
		$asset['version']
	);
}
add_action( 'enqueue_block_assets', 'gt_table_block_frontend_assets' );
