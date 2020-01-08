/*!
 * VisualEditor ContentEditable TableCellNode class.
 *
 * @copyright 2011-2020 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * ContentEditable table cell node.
 *
 * @class
 * @extends ve.ce.BranchNode
 * @mixins ve.ce.TableCellableNode
 * @mixins ve.ce.ContentEditableNode
 * @constructor
 * @param {ve.dm.TableCellNode} model Model to observe
 * @param {Object} [config] Configuration options
 */
ve.ce.TableCellNode = function VeCeTableCellNode() {
	// Parent constructor
	ve.ce.TableCellNode.super.apply( this, arguments );

	// Mixin constructors
	ve.ce.TableCellableNode.call( this );
	ve.ce.ContentEditableNode.call( this );

	this.setEditing( false );

	// Events
	this.model.connect( this, {
		update: 'onUpdate',
		attributeChange: 'onAttributeChange'
	} );
};

/* Inheritance */

OO.inheritClass( ve.ce.TableCellNode, ve.ce.BranchNode );

OO.mixinClass( ve.ce.TableCellNode, ve.ce.TableCellableNode );
OO.mixinClass( ve.ce.TableCellNode, ve.ce.ContentEditableNode );

/* Static Properties */

ve.ce.TableCellNode.static.name = 'tableCell';

ve.ce.TableCellNode.static.trapsCursor = true;

/* Methods */

/**
 * @inheritdoc
 */
ve.ce.TableCellNode.prototype.initialize = function () {
	var rowspan, colspan;

	// Parent method
	ve.ce.TableCellNode.super.prototype.initialize.call( this );

	rowspan = this.model.getRowspan();
	colspan = this.model.getColspan();

	// DOM changes
	this.$element
		// The following classes can be used here:
		// * ve-ce-tableCellNode-data
		// * ve-ce-tableCellNode-header
		.addClass( 've-ce-tableCellNode ve-ce-tableCellNode-' + this.model.getAttribute( 'style' ) );

	// Set attributes (keep in sync with #onSetup)
	if ( rowspan > 1 ) {
		this.$element.attr( 'rowspan', rowspan );
	}
	if ( colspan > 1 ) {
		this.$element.attr( 'colspan', colspan );
	}

	// Add tooltip
	this.$element.attr( 'title', ve.msg( 'visualeditor-tablecell-tooltip' ) );
};

/**
 * Set the editing mode of a table cell node
 *
 * @param {boolean} enable Enable editing
 */
ve.ce.TableCellNode.prototype.setEditing = function ( enable ) {
	this.editing = enable;
	this.$element.toggleClass( 've-ce-tableCellNode-editing', enable );
	this.setContentEditable();
	if ( this.getRoot() ) {
		this.getRoot().getSurface().setActiveNode( enable ? this : null );
	}
	if ( enable ) {
		this.$element.removeAttr( 'title' );
	} else {
		this.$element.attr( 'title', ve.msg( 'visualeditor-tablecell-tooltip' ) );
	}
};

/**
 * @inheritdoc ve.ce.ContentEditableNode
 */
ve.ce.TableCellNode.prototype.setContentEditable = function () {
	// Overwite any state passed to setContentEditable with this.editing, so that
	// setContentEditable doesn't override the editing state.
	return ve.ce.ContentEditableNode.prototype.setContentEditable.call( this, this.editing );
};

/**
 * Handle model update events.
 *
 * If the style changed since last update the DOM wrapper will be replaced with an appropriate one.
 */
ve.ce.TableCellNode.prototype.onUpdate = function () {
	this.updateTagName();
};

/**
 * Handle attribute changes to keep the live HTML element updated.
 *
 * @param {string} key Attribute name
 * @param {Mixed} from Old value
 * @param {Mixed} to Old value
 */
ve.ce.TableCellNode.prototype.onAttributeChange = function ( key, from, to ) {
	switch ( key ) {
		case 'colspan':
		case 'rowspan':
			if ( to > 1 ) {
				this.$element.attr( key, to );
			} else {
				this.$element.removeAttr( key );
			}
			break;
		case 'style':
			// The following classes can be used here:
			// * ve-ce-tableCellNode-data
			// * ve-ce-tableCellNode-header
			this.$element
				.removeClass( 've-ce-tableCellNode-' + from )
				.addClass( 've-ce-tableCellNode-' + to );
			this.updateTagName();
			break;
	}
};

/* Registration */

ve.ce.nodeFactory.register( ve.ce.TableCellNode );
