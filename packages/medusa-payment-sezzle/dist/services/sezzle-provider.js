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
var _axios = _interopRequireDefault(require("axios"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var SezzleProviderService = /*#__PURE__*/function (_PaymentService) {
  function SezzleProviderService(_ref, options) {
    var _this;
    (0, _objectDestructuringEmpty2["default"])(_ref);
    (0, _classCallCheck2["default"])(this, SezzleProviderService);
    _this = _callSuper(this, SezzleProviderService, [{}, options]);
    _this.options_ = options;

    // Set API endpoint based on sandbox mode
    _this.isSandbox = options.sandbox_mode === "true";
    _this.apiUrl = _this.isSandbox ? "https://sandbox.gateway.sezzle.com/v2" : "https://gateway.sezzle.com/v2";

    // Configuration for capture mode
    _this.captureMode = options.capture_mode || "manual"; // Can be "automatic" or "manual"
    return _this;
  }
  (0, _inherits2["default"])(SezzleProviderService, _PaymentService);
  return (0, _createClass2["default"])(SezzleProviderService, [{
    key: "paymentProviderName",
    get: function get() {
      return "Sezzle";
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
      return {
        publicKey: this.options_.public_key,
        sandbox: this.isSandbox
      };
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
        var amount, currency_code, customer, resource_id, medusaContext, orderDetails, response, paymentData;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              amount = context.amount, currency_code = context.currency_code, customer = context.customer, resource_id = context.resource_id, medusaContext = context.context; // Create a Sezzle checkout session
              _context3.prev = 1;
              // Format the order details for Sezzle
              orderDetails = {
                amount: {
                  amount_in_cents: amount,
                  // Medusa stores amount in cents already
                  currency: currency_code.toUpperCase()
                },
                order: {
                  intent: "AUTH",
                  // or CAPTURE based on your configuration
                  reference_id: resource_id,
                  // Use the cart/order ID as reference
                  description: "Order from Damned Designs"
                },
                customer: {
                  email: (customer === null || customer === void 0 ? void 0 : customer.email) || "",
                  first_name: (customer === null || customer === void 0 ? void 0 : customer.first_name) || "",
                  last_name: (customer === null || customer === void 0 ? void 0 : customer.last_name) || ""
                },
                urls: {
                  // URLs for redirecting after Sezzle checkout
                  complete: "".concat(process.env.FRONTEND_URL, "/checkout/confirm"),
                  cancel: "".concat(process.env.FRONTEND_URL, "/cart")
                }
              }; // Make API call to Sezzle to create a checkout session
              _context3.next = 5;
              return _axios["default"].post("".concat(this.apiUrl, "/session"), orderDetails, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Basic ".concat(Buffer.from("".concat(this.options_.public_key, ":").concat(this.options_.private_key)).toString("base64"))
                }
              });
            case 5:
              response = _context3.sent;
              // Process Sezzle response and return payment session data
              paymentData = {
                session_id: response.data.uuid,
                order_id: response.data.order.uuid,
                checkout_url: response.data.order.checkout_url,
                status: "pending",
                data: response.data
              };
              return _context3.abrupt("return", {
                session_data: paymentData,
                update_requests: {
                  customer_metadata: {
                    sezzle_checkout_url: response.data.order.checkout_url
                  }
                }
              });
            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](1);
              console.error("Error initiating Sezzle payment:", _context3.t0);
              throw _context3.t0;
            case 14:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[1, 10]]);
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
        var order_id, response, orderStatus, updatedData;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              order_id = paymentSession.data.order_id; // Call Sezzle API to get order status
              _context4.next = 4;
              return _axios["default"].get("".concat(this.apiUrl, "/order/").concat(order_id), {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Basic ".concat(Buffer.from("".concat(this.options_.public_key, ":").concat(this.options_.private_key)).toString("base64"))
                }
              });
            case 4:
              response = _context4.sent;
              // Check if the order is authorized
              orderStatus = response.data.status;
              if (!(orderStatus === "approved")) {
                _context4.next = 11;
                break;
              }
              // Order is authorized
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "authorized",
                order_details: response.data
              });
              return _context4.abrupt("return", {
                data: updatedData,
                status: "authorized"
              });
            case 11:
              return _context4.abrupt("return", {
                data: paymentSession.data,
                status: "pending"
              });
            case 12:
              _context4.next = 18;
              break;
            case 14:
              _context4.prev = 14;
              _context4.t0 = _context4["catch"](0);
              console.error("Error authorizing Sezzle payment:", _context4.t0);
              throw _context4.t0;
            case 18:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[0, 14]]);
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
        var amount, customer, paymentSession, medusaContext;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              amount = context.amount, customer = context.customer, paymentSession = context.paymentSession, medusaContext = context.context; // Update payment details (not typically needed for Sezzle)
              // Just return the current payment session
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
        var order_id, response, updatedData;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              order_id = paymentSession.data.order_id; // Call Sezzle API to capture the payment
              _context6.next = 4;
              return _axios["default"].post("".concat(this.apiUrl, "/order/").concat(order_id, "/capture"), {
                amount: {
                  amount_in_cents: paymentSession.amount,
                  currency: paymentSession.currency_code.toUpperCase()
                }
              }, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Basic ".concat(Buffer.from("".concat(this.options_.public_key, ":").concat(this.options_.private_key)).toString("base64"))
                }
              });
            case 4:
              response = _context6.sent;
              // Process the response and update the payment status
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "captured",
                capture_details: response.data
              });
              return _context6.abrupt("return", {
                data: updatedData,
                status: "captured"
              });
            case 9:
              _context6.prev = 9;
              _context6.t0 = _context6["catch"](0);
              console.error("Error capturing Sezzle payment:", _context6.t0);
              throw _context6.t0;
            case 13:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this, [[0, 9]]);
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
        var order_id, response, updatedData;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              order_id = paymentSession.data.order_id; // Call Sezzle API to cancel the order
              _context7.next = 4;
              return _axios["default"].post("".concat(this.apiUrl, "/order/").concat(order_id, "/cancel"), {}, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Basic ".concat(Buffer.from("".concat(this.options_.public_key, ":").concat(this.options_.private_key)).toString("base64"))
                }
              });
            case 4:
              response = _context7.sent;
              // Process the response and update the payment status
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "canceled",
                cancel_details: response.data
              });
              return _context7.abrupt("return", {
                data: updatedData,
                status: "canceled"
              });
            case 9:
              _context7.prev = 9;
              _context7.t0 = _context7["catch"](0);
              console.error("Error canceling Sezzle payment:", _context7.t0);
              throw _context7.t0;
            case 13:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this, [[0, 9]]);
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
        var order_id, response, updatedData;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              order_id = paymentSession.data.order_id; // Call Sezzle API to refund the payment
              _context8.next = 4;
              return _axios["default"].post("".concat(this.apiUrl, "/order/").concat(order_id, "/refund"), {
                amount: {
                  amount_in_cents: refundAmount,
                  currency: paymentSession.currency_code.toUpperCase()
                },
                reason: "Customer request"
              }, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Basic ".concat(Buffer.from("".concat(this.options_.public_key, ":").concat(this.options_.private_key)).toString("base64"))
                }
              });
            case 4:
              response = _context8.sent;
              // Process the response and update the payment status
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "refunded",
                refund_details: response.data
              });
              return _context8.abrupt("return", {
                data: updatedData,
                status: "refunded"
              });
            case 9:
              _context8.prev = 9;
              _context8.t0 = _context8["catch"](0);
              console.error("Error refunding Sezzle payment:", _context8.t0);
              throw _context8.t0;
            case 13:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this, [[0, 9]]);
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
        var order_id, response;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              order_id = paymentSession.data.order_id; // Call Sezzle API to get order details
              _context9.next = 4;
              return _axios["default"].get("".concat(this.apiUrl, "/order/").concat(order_id), {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Basic ".concat(Buffer.from("".concat(this.options_.public_key, ":").concat(this.options_.private_key)).toString("base64"))
                }
              });
            case 4:
              response = _context9.sent;
              return _context9.abrupt("return", _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                order_details: response.data
              }));
            case 8:
              _context9.prev = 8;
              _context9.t0 = _context9["catch"](0);
              console.error("Error retrieving Sezzle payment:", _context9.t0);
              // Return the original data if we can't get updated information
              return _context9.abrupt("return", paymentSession.data);
            case 12:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this, [[0, 8]]);
      }));
      function retrievePayment(_x11) {
        return _retrievePayment.apply(this, arguments);
      }
      return retrievePayment;
    }()
  }]);
}(_medusa.PaymentService);
(0, _defineProperty2["default"])(SezzleProviderService, "identifier", "sezzle_sezzle");
var _default = exports["default"] = SezzleProviderService;