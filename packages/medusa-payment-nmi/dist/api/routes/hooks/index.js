"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = require("express");
var _bodyParser = _interopRequireDefault(require("body-parser"));
var webhookRoutes = function webhookRoutes(router) {
  router.post("/nmi", _bodyParser["default"].raw({
    type: "application/json"
  }), /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
      var event;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            // Process NMI webhook notification
            // This is a placeholder - implement actual webhook logic
            console.log("Received NMI webhook:", req.body);
            _context.prev = 1;
            // Verify webhook signature (if NMI provides one)
            // const signature = req.headers['nmi-signature'];
            // if (!isValidSignature(req.body, signature, this.options_.webhook_secret)) {
            //   return res.sendStatus(401); // Unauthorized
            // }
            // Extract relevant data from the webhook payload
            event = req.body; // Assuming JSON payload
            // Handle different event types (e.g., transaction settled, refund processed)
            _context.t0 = event.type;
            _context.next = _context.t0 === "transaction.settled" ? 6 : _context.t0 === "refund.processed" ? 8 : 10;
            break;
          case 6:
            // Update order/payment status in Medusa
            // Example: Find order by transaction ID and update payment status to captured
            // const orderService = req.scope.resolve("orderService");
            // const order = await orderService.retrieveByCartId(event.data.cart_id);
            // await orderService.updatePaymentStatus(order.id, "captured");
            console.log("Transaction settled webhook received.");
            return _context.abrupt("break", 11);
          case 8:
            // Update order/payment status in Medusa
            // Example: Find order by transaction ID and update payment status to refunded
            console.log("Refund processed webhook received.");
            return _context.abrupt("break", 11);
          case 10:
            console.log("Unhandled NMI webhook event type: ".concat(event.type));
          case 11:
            res.sendStatus(200); // Acknowledge successful receipt
            _context.next = 18;
            break;
          case 14:
            _context.prev = 14;
            _context.t1 = _context["catch"](1);
            console.error("Error processing NMI webhook:", _context.t1);
            res.sendStatus(500); // Internal Server Error
          case 18:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[1, 14]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};
var _default = exports["default"] = webhookRoutes;