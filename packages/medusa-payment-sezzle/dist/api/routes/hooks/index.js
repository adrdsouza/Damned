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
  router.post("/sezzle/webhooks", _bodyParser["default"].raw({
    type: "application/json"
  }), /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
      var event, container, orderService, sezzleProviderService, eventType, orderReference, order;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            event = JSON.parse(req.body.toString()); // Verify webhook signature (if Sezzle provides one)
            // This is an example - adjust according to Sezzle's actual webhook signature verification
            // const signature = req.headers['sezzle-signature'];
            // if (!isValidSignature(req.body, signature, options.webhook_secret)) {
            //   return res.sendStatus(401); // Unauthorized
            // }
            // Get necessary services from the container
            container = req.scope;
            orderService = container.resolve("orderService");
            sezzleProviderService = container.resolve("pp_sezzle_sezzle"); // Get event type and order reference
            eventType = event.event_type;
            orderReference = event.order_reference; // Find order by Sezzle reference
            _context.next = 9;
            return orderService.retrieveByCartId(orderReference);
          case 9:
            order = _context.sent;
            if (order) {
              _context.next = 12;
              break;
            }
            throw new Error("No order found with reference: ".concat(orderReference));
          case 12:
            _context.t0 = eventType;
            _context.next = _context.t0 === "order.completed" ? 15 : _context.t0 === "order.refunded" ? 19 : _context.t0 === "order.canceled" ? 23 : 27;
            break;
          case 15:
            _context.next = 17;
            return orderService.capturePayment(order.id);
          case 17:
            console.log("Sezzle order ".concat(orderReference, " captured via webhook"));
            return _context.abrupt("break", 28);
          case 19:
            _context.next = 21;
            return orderService.refund(order.id);
          case 21:
            console.log("Sezzle order ".concat(orderReference, " refunded via webhook"));
            return _context.abrupt("break", 28);
          case 23:
            _context.next = 25;
            return orderService.cancel(order.id);
          case 25:
            console.log("Sezzle order ".concat(orderReference, " canceled via webhook"));
            return _context.abrupt("break", 28);
          case 27:
            console.log("Unhandled Sezzle webhook event type: ".concat(eventType));
          case 28:
            // Return success response
            res.sendStatus(200);
            _context.next = 35;
            break;
          case 31:
            _context.prev = 31;
            _context.t1 = _context["catch"](0);
            console.error("Error processing Sezzle webhook:", _context.t1);
            res.sendStatus(500);
          case 35:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 31]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};
var _default = exports["default"] = webhookRoutes;