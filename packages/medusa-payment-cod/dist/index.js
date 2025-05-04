"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _codProvider = _interopRequireDefault(require("./services/cod-provider"));
var _default = exports["default"] = {
  load: function load(container, options) {
    // Register our payment service
    container.registerService({
      codProvider: function codProvider(container) {
        return new _codProvider["default"]({}, options);
      }
    });
  },
  service: _codProvider["default"]
};