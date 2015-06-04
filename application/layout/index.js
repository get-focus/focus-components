var builder = require('focus').component.builder;
var React = require('react');
var AppHeader = require('./app-header');
var stylableBehaviour = require('../../mixin/stylable');
var contentActionsMixin = {
  mixins: [stylableBehaviour],
  getDefaultProps: function getDefaultLayoutProps(){
    return {
      AppHeader: AppHeader
    };
  },
  /** @inheriteddoc */
  render: function renderActions() {
    return (
      <div className={this._getStyleClassName()} data-focus='layout'>
        <this.props.AppHeader />
        <div data-focus='menu-left'><this.props.MenuLeft /></div>
        <div data-focus='page-content'></div>
        <footer data-focus='footer'>Team Focus</footer>
        {this.props.children}
      </div>
    );
  }
};

module.exports = builder(contentActionsMixin);