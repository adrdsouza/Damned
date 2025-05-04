"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _medusa = require("@medusajs/medusa");
var _axios = _interopRequireDefault(require("axios"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var NMIProviderService = /*#__PURE__*/function (_PaymentService) {
  function NMIProviderService(_ref, options) {
    var _this;
    (0, _objectDestructuringEmpty2["default"])(_ref);
    (0, _classCallCheck2["default"])(this, NMIProviderService);
    _this = _callSuper(this, NMIProviderService, [{}, options]);
    _this.options_ = options;
    _this.nmiApiUrl = "https://secure.nmi.com/api/transact.php";
    return _this;
  }
  (0, _inherits2["default"])(NMIProviderService, _PaymentService);
  return (0, _createClass2["default"])(NMIProviderService, [{
    key: "paymentProviderName",
    get: function get() {
      return "NMI";
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

    // Define empty client configs method to avoid errors in admin
  }, {
    key: "getClientConfigs",
    value: function getClientConfigs() {
      return {};
    }

    // Define empty payment status map
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
        var amount, currency_code, customer, resource_id, medusaContext, response, paymentData;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              amount = context.amount, currency_code = context.currency_code, customer = context.customer, resource_id = context.resource_id, medusaContext = context.context; // Basic implementation - replace with actual NMI API call
              _context3.prev = 1;
              _context3.next = 4;
              return _axios["default"].post(this.nmiApiUrl, {
                security_key: this.options_.security_key,
                type: "sale",
                // Example transaction type
                amount: amount / 100,
                // NMI expects amount in dollars
                currency: currency_code
                // Add other necessary parameters based on NMI API documentation
                // e.g., customer details, card details (if applicable), order ID
              });
            case 4:
              response = _context3.sent;
              // Process NMI response and return payment session data
              // This is a placeholder - parse the actual NMI response
              paymentData = {
                id: response.data.transaction_id,
                // Example
                status: "authorized",
                // Example status based on NMI response
                data: response.data
              };
              return _context3.abrupt("return", {
                session_data: paymentData
              });
            case 9:
              _context3.prev = 9;
              _context3.t0 = _context3["catch"](1);
              console.error("Error initiating NMI payment:", _context3.t0);
              throw _context3.t0;
            case 13:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[1, 9]]);
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
        var response, updatedData;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(paymentSession.data.status === "authorized")) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return", {
                data: paymentSession.data,
                status: "authorized"
              });
            case 2:
              _context4.prev = 2;
              _context4.next = 5;
              return _axios["default"].post(this.nmiApiUrl, {
                security_key: this.options_.security_key,
                type: "auth",
                // Example transaction type
                transaction_id: paymentSession.data.id,
                // Example
                amount: paymentSession.amount / 100
              });
            case 5:
              response = _context4.sent;
              // Process NMI response and update session data
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "authorized",
                // Example status
                data: response.data
              });
              return _context4.abrupt("return", {
                data: updatedData,
                status: "authorized"
              });
            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](2);
              console.error("Error authorizing NMI payment:", _context4.t0);
              throw _context4.t0;
            case 14:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[2, 10]]);
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
        var amount, customer, paymentSession, medusaContext, response;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              amount = context.amount, customer = context.customer, paymentSession = context.paymentSession, medusaContext = context.context; // Update payment details if needed (e.g., amount change)
              // This is a placeholder - implement actual NMI update call if supported
              _context5.prev = 1;
              _context5.next = 4;
              return _axios["default"].post(this.nmiApiUrl, {
                security_key: this.options_.security_key,
                type: "void",
                // Example: void the previous transaction
                transaction_id: paymentSession.data.id
              });
            case 4:
              response = _context5.sent;
              return _context5.abrupt("return", {
                session_data: paymentSession.data
              });
            case 8:
              _context5.prev = 8;
              _context5.t0 = _context5["catch"](1);
              console.error("Error updating NMI payment:", _context5.t0);
              throw _context5.t0;
            case 12:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[1, 8]]);
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
        var response, updatedData;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return _axios["default"].post(this.nmiApiUrl, {
                security_key: this.options_.security_key,
                type: "capture",
                // Example transaction type
                transaction_id: paymentSession.data.id,
                // Example
                amount: paymentSession.amount / 100
              });
            case 3:
              response = _context6.sent;
              // Process NMI response and return updated session data
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "captured",
                // Example status
                data: response.data
              });
              return _context6.abrupt("return", {
                data: updatedData,
                status: "captured"
              });
            case 8:
              _context6.prev = 8;
              _context6.t0 = _context6["catch"](0);
              console.error("Error capturing NMI payment:", _context6.t0);
              throw _context6.t0;
            case 12:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this, [[0, 8]]);
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
        var response, updatedData;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return _axios["default"].post(this.nmiApiUrl, {
                security_key: this.options_.security_key,
                type: "void",
                // Example transaction type
                transaction_id: paymentSession.data.id // Example
              });
            case 3:
              response = _context7.sent;
              // Process NMI response and return updated session data
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "canceled",
                // Example status
                data: response.data
              });
              return _context7.abrupt("return", {
                data: updatedData,
                status: "canceled"
              });
            case 8:
              _context7.prev = 8;
              _context7.t0 = _context7["catch"](0);
              console.error("Error canceling NMI payment:", _context7.t0);
              throw _context7.t0;
            case 12:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this, [[0, 8]]);
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
        var response, updatedData;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return _axios["default"].post(this.nmiApiUrl, {
                security_key: this.options_.security_key,
                type: "refund",
                // Example transaction type
                transaction_id: paymentSession.data.id,
                // Example
                amount: refundAmount / 100
              });
            case 3:
              response = _context8.sent;
              // Process NMI response and return updated session data
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "refunded",
                // Example status
                data: response.data
              });
              return _context8.abrupt("return", {
                data: updatedData,
                status: "refunded"
              });
            case 8:
              _context8.prev = 8;
              _context8.t0 = _context8["catch"](0);
              console.error("Error refunding NMI payment:", _context8.t0);
              throw _context8.t0;
            case 12:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this, [[0, 8]]);
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
              // Retrieve payment details (if NMI supports this)
              // This is a placeholder - implement actual NMI retrieve call if supported
              // NMI's API might not have a direct "retrieve" equivalent;
              // you might need to query their transaction history or rely on webhooks.
              console.warn("retrievePayment not fully implemented for NMI");
              return _context9.abrupt("return", paymentSession.data);
            case 2:
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
NMIProviderService.identifier = "nmi_nmi";
var _default = exports["default"] = NMIProviderService;