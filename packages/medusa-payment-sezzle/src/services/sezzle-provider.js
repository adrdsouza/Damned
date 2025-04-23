import { PaymentService } from "@medusajs/medusa";
import axios from "axios";

class SezzleProviderService extends PaymentService {
  static identifier = "sezzle_sezzle";

  constructor({}, options) {
    super({}, options);

    this.options_ = options;
    
    // Set API endpoint based on sandbox mode
    this.isSandbox = options.sandbox_mode === "true";
    this.apiUrl = this.isSandbox 
      ? "https://sandbox.gateway.sezzle.com/v2" 
      : "https://gateway.sezzle.com/v2";
      
    // Configuration for capture mode
    this.captureMode = options.capture_mode || "manual"; // Can be "automatic" or "manual"
  }
  
  get paymentProviderName() {
    return "Sezzle";
  }
  
  canSavePaymentInfo() {
    return false;
  }
  
  isInstalled() {
    return true;
  }
  
  getClientConfigs() {
    return {
      publicKey: this.options_.public_key,
      sandbox: this.isSandbox,
    };
  }
  
  getPaymentStatusMap() {
    return {
      authorized: "authorized",
      pending: "pending",
      processing: "processing",
      requires_more: "requires_more",
      error: "error",
      canceled: "canceled",
    };
  }

  async getPaymentData(paymentSession) {
    return paymentSession.data;
  }

  async getPaymentStatus(paymentSession) {
    // Get status from payment session data or check with Sezzle API
    return paymentSession.data.status || "pending";
  }

  async initiatePayment(context) {
    const { amount, currency_code, customer, resource_id, context: medusaContext } = context;

    // Create a Sezzle checkout session
    try {
      // Format the order details for Sezzle
      const orderDetails = {
        amount: {
          amount_in_cents: amount, // Medusa stores amount in cents already
          currency: currency_code.toUpperCase()
        },
        order: {
          intent: "AUTH", // or CAPTURE based on your configuration
          reference_id: resource_id, // Use the cart/order ID as reference
          description: "Order from Damned Designs",
        },
        customer: {
          email: customer?.email || "",
          first_name: customer?.first_name || "",
          last_name: customer?.last_name || ""
        },
        urls: {
          // URLs for redirecting after Sezzle checkout
          complete: `${process.env.FRONTEND_URL}/checkout/confirm`,
          cancel: `${process.env.FRONTEND_URL}/cart`,
        }
      };

      // Make API call to Sezzle to create a checkout session
      const response = await axios.post(
        `${this.apiUrl}/session`, 
        orderDetails,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(`${this.options_.public_key}:${this.options_.private_key}`).toString("base64")}`
          }
        }
      );

      // Process Sezzle response and return payment session data
      const paymentData = {
        session_id: response.data.uuid,
        order_id: response.data.order.uuid,
        checkout_url: response.data.order.checkout_url,
        status: "pending",
        data: response.data,
      };

      return {
        session_data: paymentData,
        update_requests: {
          customer_metadata: {
            sezzle_checkout_url: response.data.order.checkout_url,
          }
        }
      };
    } catch (error) {
      console.error("Error initiating Sezzle payment:", error);
      throw error;
    }
  }

  async authorizePayment(paymentSession, context) {
    // Check payment status with Sezzle API
    try {
      const { order_id } = paymentSession.data;
      
      // Call Sezzle API to get order status
      const response = await axios.get(
        `${this.apiUrl}/order/${order_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(`${this.options_.public_key}:${this.options_.private_key}`).toString("base64")}`
          }
        }
      );
      
      // Check if the order is authorized
      const orderStatus = response.data.status;
      
      if (orderStatus === "approved") {
        // Order is authorized
        const updatedData = {
          ...paymentSession.data,
          status: "authorized",
          order_details: response.data
        };
        
        return { data: updatedData, status: "authorized" };
      } else {
        // Order is not yet authorized
        return { data: paymentSession.data, status: "pending" };
      }
    } catch (error) {
      console.error("Error authorizing Sezzle payment:", error);
      throw error;
    }
  }

  async updatePayment(context) {
    const { amount, customer, paymentSession, context: medusaContext } = context;

    // Update payment details (not typically needed for Sezzle)
    // Just return the current payment session
    return { session_data: paymentSession.data };
  }

  async capturePayment(paymentSession) {
    // Capture the authorized payment
    try {
      const { order_id } = paymentSession.data;
      
      // Call Sezzle API to capture the payment
      const response = await axios.post(
        `${this.apiUrl}/order/${order_id}/capture`,
        {
          amount: {
            amount_in_cents: paymentSession.amount,
            currency: paymentSession.currency_code.toUpperCase()
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(`${this.options_.public_key}:${this.options_.private_key}`).toString("base64")}`
          }
        }
      );
      
      // Process the response and update the payment status
      const updatedData = {
        ...paymentSession.data,
        status: "captured",
        capture_details: response.data
      };
      
      return { data: updatedData, status: "captured" };
    } catch (error) {
      console.error("Error capturing Sezzle payment:", error);
      throw error;
    }
  }

  async cancelPayment(paymentSession) {
    // Cancel the payment
    try {
      const { order_id } = paymentSession.data;
      
      // Call Sezzle API to cancel the order
      const response = await axios.post(
        `${this.apiUrl}/order/${order_id}/cancel`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(`${this.options_.public_key}:${this.options_.private_key}`).toString("base64")}`
          }
        }
      );
      
      // Process the response and update the payment status
      const updatedData = {
        ...paymentSession.data,
        status: "canceled",
        cancel_details: response.data
      };
      
      return { data: updatedData, status: "canceled" };
    } catch (error) {
      console.error("Error canceling Sezzle payment:", error);
      throw error;
    }
  }

  async refundPayment(paymentSession, refundAmount) {
    // Refund the payment
    try {
      const { order_id } = paymentSession.data;
      
      // Call Sezzle API to refund the payment
      const response = await axios.post(
        `${this.apiUrl}/order/${order_id}/refund`,
        {
          amount: {
            amount_in_cents: refundAmount,
            currency: paymentSession.currency_code.toUpperCase()
          },
          reason: "Customer request"
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(`${this.options_.public_key}:${this.options_.private_key}`).toString("base64")}`
          }
        }
      );
      
      // Process the response and update the payment status
      const updatedData = {
        ...paymentSession.data,
        status: "refunded",
        refund_details: response.data
      };
      
      return { data: updatedData, status: "refunded" };
    } catch (error) {
      console.error("Error refunding Sezzle payment:", error);
      throw error;
    }
  }

  async retrievePayment(paymentSession) {
    // Retrieve current payment details from Sezzle
    try {
      const { order_id } = paymentSession.data;
      
      // Call Sezzle API to get order details
      const response = await axios.get(
        `${this.apiUrl}/order/${order_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(`${this.options_.public_key}:${this.options_.private_key}`).toString("base64")}`
          }
        }
      );
      
      // Return the order details
      return {
        ...paymentSession.data,
        order_details: response.data
      };
    } catch (error) {
      console.error("Error retrieving Sezzle payment:", error);
      // Return the original data if we can't get updated information
      return paymentSession.data;
    }
  }
}

export default SezzleProviderService;