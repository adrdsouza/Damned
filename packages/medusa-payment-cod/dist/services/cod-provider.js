"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _medusa = require("@medusajs/medusa");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var CodProviderService = /*#__PURE__*/function (_PaymentService) {
  function CodProviderService(_ref, options) {
    var _this;
    (0, _objectDestructuringEmpty2["default"])(_ref);
    (0, _classCallCheck2["default"])(this, CodProviderService);
    _this = _callSuper(this, CodProviderService, [{}, options]);
    _this.options_ = options;
    return _this;
  }
  (0, _inherits2["default"])(CodProviderService, _PaymentService);
  return (0, _createClass2["default"])(CodProviderService, [{
    key: "paymentProviderName",
    get: function get() {
      return "Cash on Delivery";
    }
  }, {
    key: "canSavePaymentInfo",
    value: function canSavePaymentInfo() {
      return false;
    }
  }, {
    key: "isInstalled",
    value: function isInstalled() {
      return true;
    }
  }, {
    key: "getClientConfigs",
    value: function getClientConfigs() {
      return {};
    }
  }, {
    key: "getPaymentStatusMap",
    value: function getPaymentStatusMap() {
      return {
        authorized: "authorized",
        pending: "pending",
        processing: "processing",
        requires_more: "requires_more",
        error: "error",
        canceled: "canceled"
      };
    }
  }, {
    key: "getPaymentData",
    value: function () {
      var _getPaymentData = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(paymentSession) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", paymentSession.data);
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function getPaymentData(_x) {
        return _getPaymentData.apply(this, arguments);
      }
      return getPaymentData;
    }()
  }, {
    key: "getPaymentStatus",
    value: function () {
      var _getPaymentStatus = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(paymentSession) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", paymentSession.data.status || "pending");
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function getPaymentStatus(_x2) {
        return _getPaymentStatus.apply(this, arguments);
      }
      return getPaymentStatus;
    }()
  }, {
    key: "initiatePayment",
    value: function () {
      var _initiatePayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(context) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", {
                session_data: {
                  status: "pending"
                }
              });
            case 1:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function initiatePayment(_x3) {
        return _initiatePayment.apply(this, arguments);
      }
      return initiatePayment;
    }()
  }, {
    key: "authorizePayment",
    value: function () {
      var _authorizePayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(paymentSession, context) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", {
                data: _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                  status: "authorized"
                }),
                status: "authorized"
              });
            case 1:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function authorizePayment(_x4, _x5) {
        return _authorizePayment.apply(this, arguments);
      }
      return authorizePayment;
    }()
  }, {
    key: "updatePayment",
    value: function () {
      var _updatePayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(context) {
        var paymentSession;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              paymentSession = context.paymentSession;
              return _context5.abrupt("return", {
                session_data: paymentSession.data
              });
            case 2:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function updatePayment(_x6) {
        return _updatePayment.apply(this, arguments);
      }
      return updatePayment;
    }()
  }, {
    key: "capturePayment",
    value: function () {
      var _capturePayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(paymentSession) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              return _context6.abrupt("return", {
                data: _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                  status: "captured"
                }),
                status: "captured"
              });
            case 1:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function capturePayment(_x7) {
        return _capturePayment.apply(this, arguments);
      }
      return capturePayment;
    }()
  }, {
    key: "cancelPayment",
    value: function () {
      var _cancelPayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(paymentSession) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              return _context7.abrupt("return", {
                data: _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                  status: "canceled"
                }),
                status: "canceled"
              });
            case 1:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function cancelPayment(_x8) {
        return _cancelPayment.apply(this, arguments);
      }
      return cancelPayment;
    }()
  }, {
    key: "refundPayment",
    value: function () {
      var _refundPayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(paymentSession, refundAmount) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              return _context8.abrupt("return", {
                data: _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                  status: "refunded"
                }),
                status: "refunded"
              });
            case 1:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function refundPayment(_x9, _x10) {
        return _refundPayment.apply(this, arguments);
      }
      return refundPayment;
    }()
  }, {
    key: "retrievePayment",
    value: function () {
      var _retrievePayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(paymentSession) {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              return _context9.abrupt("return", paymentSession.data);
            case 1:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function retrievePayment(_x11) {
        return _retrievePayment.apply(this, arguments);
      }
      return retrievePayment;
    }()
  }]);
}(_medusa.PaymentService);
(0, _defineProperty2["default"])(CodProviderService, "identifier", "cod_cod");
var _default = exports["default"] = CodProviderService;