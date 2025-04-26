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
var SezzleProviderService = /*#__PURE__*/function (_PaymentService) {
  function SezzleProviderService(_ref, options) {
    var _this;
    (0, _objectDestructuringEmpty2["default"])(_ref);
    (0, _classCallCheck2["default"])(this, SezzleProviderService);
    _this = _callSuper(this, SezzleProviderService, [{}, options]);
    _this.options_ = options;

    // Set API endpoint based on sandbox mode
    _this.isSandbox = options.sandbox_mode === "true";
    _this.apiUrl = _this.isSandbox ? "https://sandbox.gateway.sezzle.com" : "https://gateway.sezzle.com";

    // Authentication token cache with expiration time
    _this.authToken = null;
    _this.tokenExpiration = null;

    // Configuration for capture mode
    _this.captureMode = options.capture_mode || "manual"; // Can be "automatic" or "manual"
    return _this;
  }

  /**
   * Get authentication token for Sezzle API
   * Tokens are valid for 120 minutes, but we'll refresh after 110 minutes
   */
  (0, _inherits2["default"])(SezzleProviderService, _PaymentService);
  return (0, _createClass2["default"])(SezzleProviderService, [{
    key: "getAuthToken",
    value: (function () {
      var _getAuthToken = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var now, authResponse, expirationDate;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              now = new Date(); // If token exists and is not expired, return it
              if (!(this.authToken && this.tokenExpiration && now < this.tokenExpiration)) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return", this.authToken);
            case 3:
              _context.prev = 3;
              _context.next = 6;
              return _axios["default"].post("".concat(this.apiUrl, "/v2/authentication"), {
                public_key: this.options_.public_key,
                private_key: this.options_.private_key
              }, {
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                }
              });
            case 6:
              authResponse = _context.sent;
              // Store token and expiration time (subtract 10 minutes to be safe)
              this.authToken = authResponse.data.token;

              // Parse expiration date from response and subtract 10 minutes
              expirationDate = new Date(authResponse.data.expiration_date);
              this.tokenExpiration = new Date(expirationDate.getTime() - 10 * 60 * 1000);
              return _context.abrupt("return", this.authToken);
            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](3);
              console.error("Error obtaining Sezzle authentication token:", _context.t0);
              throw _context.t0;
            case 17:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[3, 13]]);
      }));
      function getAuthToken() {
        return _getAuthToken.apply(this, arguments);
      }
      return getAuthToken;
    }())
  }, {
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
      var _getPaymentData = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(paymentSession) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", paymentSession.data);
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function getPaymentData(_x) {
        return _getPaymentData.apply(this, arguments);
      }
      return getPaymentData;
    }()
  }, {
    key: "getPaymentStatus",
    value: function () {
      var _getPaymentStatus = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(paymentSession) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", paymentSession.data.status || "pending");
            case 1:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getPaymentStatus(_x2) {
        return _getPaymentStatus.apply(this, arguments);
      }
      return getPaymentStatus;
    }()
  }, {
    key: "initiatePayment",
    value: function () {
      var _initiatePayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(context) {
        var amount, currency_code, customer, resource_id, medusaContext, _medusaContext$cart, authToken, billingAddress, sessionPayload, response, paymentData;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              amount = context.amount, currency_code = context.currency_code, customer = context.customer, resource_id = context.resource_id, medusaContext = context.context; // Create a Sezzle card session
              _context4.prev = 1;
              _context4.next = 4;
              return this.getAuthToken();
            case 4:
              authToken = _context4.sent;
              // Get customer billing address from context if available
              billingAddress = (customer === null || customer === void 0 ? void 0 : customer.billing_address) || {}; // Format the order details for Sezzle card session
              sessionPayload = {
                origin: process.env.FRONTEND_URL || "https://damneddesigns.com",
                mode: "iframe",
                merchant_reference_id: resource_id,
                // Use the cart/order ID as reference
                amount_in_cents: amount,
                // Medusa stores amount in cents already
                currency: currency_code.toUpperCase(),
                customer: {
                  email: (customer === null || customer === void 0 ? void 0 : customer.email) || "",
                  first_name: (customer === null || customer === void 0 ? void 0 : customer.first_name) || "",
                  last_name: (customer === null || customer === void 0 ? void 0 : customer.last_name) || "",
                  phone: (customer === null || customer === void 0 ? void 0 : customer.phone) || "",
                  billing_address: {
                    street: billingAddress.address_1 || "",
                    street2: billingAddress.address_2 || "",
                    city: billingAddress.city || "",
                    state: billingAddress.province || "",
                    postal_code: billingAddress.postal_code || "",
                    country_code: billingAddress.country_code || "US"
                  }
                }
              }; // Add cart items if available in context
              if ((medusaContext === null || medusaContext === void 0 || (_medusaContext$cart = medusaContext.cart) === null || _medusaContext$cart === void 0 || (_medusaContext$cart = _medusaContext$cart.items) === null || _medusaContext$cart === void 0 ? void 0 : _medusaContext$cart.length) > 0) {
                sessionPayload.items = medusaContext.cart.items.map(function (item) {
                  var _item$variant;
                  return {
                    name: item.title,
                    sku: ((_item$variant = item.variant) === null || _item$variant === void 0 ? void 0 : _item$variant.sku) || item.id,
                    quantity: item.quantity,
                    price: {
                      amount_in_cents: item.unit_price * item.quantity,
                      currency: currency_code.toUpperCase()
                    }
                  };
                });
              }

              // Make API call to Sezzle to create a card session
              _context4.next = 10;
              return _axios["default"].post("".concat(this.apiUrl, "/v2/session/card"), sessionPayload, {
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  "Authorization": "Bearer ".concat(authToken)
                }
              });
            case 10:
              response = _context4.sent;
              // Process Sezzle response and return payment session data
              paymentData = {
                session_id: response.data.uuid,
                dashboard_url: response.data.dashboard_url,
                status: "pending",
                data: response.data
              };
              return _context4.abrupt("return", {
                session_data: paymentData,
                update_requests: {
                  customer_metadata: {
                    sezzle_dashboard_url: response.data.dashboard_url
                  }
                }
              });
            case 15:
              _context4.prev = 15;
              _context4.t0 = _context4["catch"](1);
              console.error("Error initiating Sezzle payment:", _context4.t0);
              throw _context4.t0;
            case 19:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[1, 15]]);
      }));
      function initiatePayment(_x3) {
        return _initiatePayment.apply(this, arguments);
      }
      return initiatePayment;
    }()
  }, {
    key: "authorizePayment",
    value: function () {
      var _authorizePayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(paymentSession, context) {
        var _context$order, session_id, authToken, orderId, updatedData;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              // For Sezzle Card payments, we assume authorized once the card data has been created
              // and the payment is processed by the merchant's regular payment processor
              // Get session details from paymentSession
              session_id = paymentSession.data.session_id; // Get authentication token first
              _context5.next = 4;
              return this.getAuthToken();
            case 4:
              authToken = _context5.sent;
              // We need to attempt to update the session with order information
              // This informs Sezzle that the order has been completed
              orderId = (context === null || context === void 0 || (_context$order = context.order) === null || _context$order === void 0 ? void 0 : _context$order.id) || (context === null || context === void 0 ? void 0 : context.resource_id);
              if (!orderId) {
                _context5.next = 17;
                break;
              }
              _context5.prev = 7;
              _context5.next = 10;
              return _axios["default"].patch("".concat(this.apiUrl, "/v2/session/").concat(session_id, "/card"), {
                order_id: orderId
              }, {
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  "Authorization": "Bearer ".concat(authToken)
                }
              });
            case 10:
              // Update the payment session status to authorized
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "authorized",
                order_id: orderId
              });
              return _context5.abrupt("return", {
                data: updatedData,
                status: "authorized"
              });
            case 14:
              _context5.prev = 14;
              _context5.t0 = _context5["catch"](7);
              console.error("Error updating Sezzle session with order ID:", _context5.t0);
              // Continue with authorization process even if update fails
            case 17:
              return _context5.abrupt("return", {
                data: paymentSession.data,
                status: "pending"
              });
            case 20:
              _context5.prev = 20;
              _context5.t1 = _context5["catch"](0);
              console.error("Error authorizing Sezzle payment:", _context5.t1);
              throw _context5.t1;
            case 24:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[0, 20], [7, 14]]);
      }));
      function authorizePayment(_x4, _x5) {
        return _authorizePayment.apply(this, arguments);
      }
      return authorizePayment;
    }()
  }, {
    key: "updatePayment",
    value: function () {
      var _updatePayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(context) {
        var amount, customer, paymentSession, medusaContext;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              amount = context.amount, customer = context.customer, paymentSession = context.paymentSession, medusaContext = context.context; // Update payment details (not typically needed for Sezzle)
              // Just return the current payment session
              return _context6.abrupt("return", {
                session_data: paymentSession.data
              });
            case 2:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function updatePayment(_x6) {
        return _updatePayment.apply(this, arguments);
      }
      return updatePayment;
    }()
  }, {
    key: "capturePayment",
    value: function () {
      var _capturePayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(paymentSession) {
        var updatedData;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              // For Sezzle Card sessions, capture is not needed as the virtual card
              // is already charged via the regular payment processor
              // We simply update the status to captured
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "captured"
              });
              return _context7.abrupt("return", {
                data: updatedData,
                status: "captured"
              });
            case 2:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function capturePayment(_x7) {
        return _capturePayment.apply(this, arguments);
      }
      return capturePayment;
    }()
  }, {
    key: "cancelPayment",
    value: function () {
      var _cancelPayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(paymentSession) {
        var updatedData;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              // For Sezzle Card sessions, cancellation should be handled by the merchant
              // through their regular payment processor
              // We simply update the status to canceled
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "canceled"
              });
              return _context8.abrupt("return", {
                data: updatedData,
                status: "canceled"
              });
            case 2:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function cancelPayment(_x8) {
        return _cancelPayment.apply(this, arguments);
      }
      return cancelPayment;
    }()
  }, {
    key: "refundPayment",
    value: function () {
      var _refundPayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(paymentSession, refundAmount) {
        var updatedData;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              // For Sezzle Card sessions, refunds should be handled by the merchant
              // through their regular payment processor
              // We simply update the status to refunded
              updatedData = _objectSpread(_objectSpread({}, paymentSession.data), {}, {
                status: "refunded",
                refund_amount: refundAmount
              });
              return _context9.abrupt("return", {
                data: updatedData,
                status: "refunded"
              });
            case 2:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function refundPayment(_x9, _x10) {
        return _refundPayment.apply(this, arguments);
      }
      return refundPayment;
    }()
  }, {
    key: "retrievePayment",
    value: function () {
      var _retrievePayment = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(paymentSession) {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt("return", paymentSession.data);
            case 1:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      function retrievePayment(_x11) {
        return _retrievePayment.apply(this, arguments);
      }
      return retrievePayment;
    }()
  }]);
}(_medusa.PaymentService);
SezzleProviderService.identifier = "sezzle_sezzle";
var _default = exports["default"] = SezzleProviderService;