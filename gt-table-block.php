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
 * Enqueue editor-only script.
 *
 * Loads the block variation registration, attribute extensions, and
 * InspectorControls filters into the block editor. Styles load via
 * gt_table_block_frontend_assets() below so they reach the WP 6.3+
 * editor iframe (enqueue_block_editor_assets styles do not).
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
}
add_action( 'enqueue_block_editor_assets', 'gt_table_block_editor_assets' );

/**
 * Enqueue block styles (editor iframe + frontend).
 *
 * src/style.scss is auto-extracted by @wordpress/scripts into style-index.css.
 * enqueue_block_assets fires in both contexts and its styles cross into the
 * editor iframe, which enqueue_block_editor_assets styles do not.
 */
function gt_table_block_frontend_assets(): void {
	$asset_file = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = require $asset_file;

	// No style dependency: our selectors (.wp-block-table.has-*) don't require
	// core's wp-block-table stylesheet to be loaded first, and declaring it as
	// a dep forces an unwanted load order in the WP 6.3+ editor iframe that
	// disrupts editor-chrome styles (blank table area, mis-styled appender).
	wp_enqueue_style(
		'gt-table-block',
		plugin_dir_url( __FILE__ ) . 'build/style-index.css',
		[],
		$asset['version']
	);
}
add_action( 'enqueue_block_assets', 'gt_table_block_frontend_assets' );
