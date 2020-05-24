/* config-overrides.js */
const {
    override,
    addDecoratorsLegacy,
    addBabelPlugin
} = require("customize-cra");

module.exports = override(addDecoratorsLegacy(), addBabelPlugin('babel-plugin-transform-typescript-metadata'));
