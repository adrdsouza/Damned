import { PaymentService } from "@medusajs/medusa";
import axios from "axios";

class NMIProviderService extends PaymentService {
  static identifier = "nmi_nmi";

  constructor({ }, options) {
    super({}, options);

    this.options_ = options;
    this.nmiApiUrl = "https://secure.nmi.com/api/transact.php";
  }
  
  get paymentProviderName() {
    return "NMI";
  }
  
  canSavePaymentInfo() {
    return false;
  }
  
  isInstalled() {
    return true;
  }
  
  // Define empty client configs method to avoid errors in admin
  getClientConfigs() {
    return {};
  }
  
  // Define empty payment status map
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
    // NMI doesn't have a direct status check API.
    // We rely on webhooks for status updates.
    // For now, return the current status from the session data.
    return paymentSession.data.status || "pending";
  }

  async initiatePayment(context) {
    const { amount, currency_code, customer, resource_id, context: medusaContext } = context;

    // Basic implementation - replace with actual NMI API call
    try {
      const response = await axios.post(this.nmiApiUrl, {
        security_key: this.options_.security_key,
        type: "sale", // Example transaction type
        amount: amount / 100, // NMI expects amount in dollars
        currency: currency_code,
        // Add other necessary parameters based on NMI API documentation
        // e.g., customer details, card details (if applicable), order ID
      });

      // Process NMI response and return payment session data
      // This is a placeholder - parse the actual NMI response
      const paymentData = {
        id: response.data.transaction_id, // Example
        status: "authorized", // Example status based on NMI response
        data: response.data,
      };

      return {
        session_data: paymentData,
      };
    } catch (error) {
      console.error("Error initiating NMI payment:", error);
      throw error;
    }
  }

  async authorizePayment(paymentSession, context) {
    // If initiatePayment already authorized, just return the session
    if (paymentSession.data.status === "authorized") {
      return { data: paymentSession.data, status: "authorized" };
    }

    // If not authorized, perform authorization (if NMI supports separate auth)
    // This is a placeholder - implement actual NMI authorization call
    try {
      const response = await axios.post(this.nmiApiUrl, {
        security_key: this.options_.security_key,
        type: "auth", // Example transaction type
        transaction_id: paymentSession.data.id, // Example
        amount: paymentSession.amount / 100,
      });

      // Process NMI response and update session data
      const updatedData = {
        ...paymentSession.data,
        status: "authorized", // Example status
        data: response.data,
      };

      return { data: updatedData, status: "authorized" };
    } catch (error) {
      console.error("Error authorizing NMI payment:", error);
      throw error;
    }
  }

  async updatePayment(context) {
    const { amount, customer, paymentSession, context: medusaContext } = context;

    // Update payment details if needed (e.g., amount change)
    // This is a placeholder - implement actual NMI update call if supported
    try {
      // Example: If amount changed, potentially void and re-authorize or adjust
      // NMI API might have specific calls for this
      const response = await axios.post(this.nmiApiUrl, {
        security_key: this.options_.security_key,
        type: "void", // Example: void the previous transaction
        transaction_id: paymentSession.data.id,
      });

      // After voiding, initiate a new payment or update the existing one
      // This is complex and depends heavily on NMI's API capabilities
      // For simplicity, this example just returns the existing session data
      return { session_data: paymentSession.data };
    } catch (error) {
      console.error("Error updating NMI payment:", error);
      throw error;
    }
  }

  async capturePayment(paymentSession) {
    // Capture the authorized payment
    // This is a placeholder - implement actual NMI capture call
    try {
      const response = await axios.post(this.nmiApiUrl, {
        security_key: this.options_.security_key,
        type: "capture", // Example transaction type
        transaction_id: paymentSession.data.id, // Example
        amount: paymentSession.amount / 100,
      });

      // Process NMI response and return updated session data
      const updatedData = {
        ...paymentSession.data,
        status: "captured", // Example status
        data: response.data,
      };

      return { data: updatedData, status: "captured" };
    } catch (error) {
      console.error("Error capturing NMI payment:", error);
      throw error;
    }
  }

  async cancelPayment(paymentSession) {
    // Cancel the payment
    // This is a placeholder - implement actual NMI cancel/void call
    try {
      const response = await axios.post(this.nmiApiUrl, {
        security_key: this.options_.security_key,
        type: "void", // Example transaction type
        transaction_id: paymentSession.data.id, // Example
      });

      // Process NMI response and return updated session data
      const updatedData = {
        ...paymentSession.data,
        status: "canceled", // Example status
        data: response.data,
      };

      return { data: updatedData, status: "canceled" };
    } catch (error) {
      console.error("Error canceling NMI payment:", error);
      throw error;
    }
  }

  async refundPayment(paymentSession, refundAmount) {
    // Refund the payment
    // This is a placeholder - implement actual NMI refund call
    try {
      const response = await axios.post(this.nmiApiUrl, {
        security_key: this.options_.security_key,
        type: "refund", // Example transaction type
        transaction_id: paymentSession.data.id, // Example
        amount: refundAmount / 100,
      });

      // Process NMI response and return updated session data
      const updatedData = {
        ...paymentSession.data,
        status: "refunded", // Example status
        data: response.data,
      };

      return { data: updatedData, status: "refunded" };
    } catch (error) {
      console.error("Error refunding NMI payment:", error);
      throw error;
    }
  }

  async retrievePayment(paymentSession) {
    // Retrieve payment details (if NMI supports this)
    // This is a placeholder - implement actual NMI retrieve call if supported
    // NMI's API might not have a direct "retrieve" equivalent;
    // you might need to query their transaction history or rely on webhooks.
    console.warn("retrievePayment not fully implemented for NMI");
    return paymentSession.data;
  }
}

export default NMIProviderService;