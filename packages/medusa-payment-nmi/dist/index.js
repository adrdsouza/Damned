"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _nmiProvider = _interopRequireDefault(require("./services/nmi-provider"));
var _hooks = _interopRequireDefault(require("./api/routes/hooks"));
var _default = exports["default"] = {
  load: function load(container, options) {
    // Register our payment service
    container.registerService({
      nmiProvider: function nmiProvider(container) {
        return new _nmiProvider["default"]({}, options);
      }
    });
    var router = (0, _express.Router)();
    var corsOptions = {
      origin: process.env.FRONTEND_URL,
      credentials: true
    };
    router.use((0, _cors["default"])(corsOptions));
    router.use(_bodyParser["default"].json());
    (0, _hooks["default"])(router);
    return router;
  },
  service: _nmiProvider["default"]
};