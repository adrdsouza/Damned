import { PaymentService } from "@medusajs/medusa";

class CodProviderService extends PaymentService {
  static identifier = "cod_cod";

  constructor({}, options) {
    super({}, options);
    this.options_ = options;
  }

  get paymentProviderName() {
    return "Cash on Delivery";
  }

  canSavePaymentInfo() {
    return false;
  }

  isInstalled() {
    return true;
  }

  getClientConfigs() {
    return {};
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
    return paymentSession.data.status || "pending";
  }

  async initiatePayment(context) {
    // No actual payment processing needed for COD
    return {
      session_data: {
        status: "pending"
      }
    };
  }

  async authorizePayment(paymentSession, context) {
    // Automatically authorize COD payments
    return { 
      data: {
        ...paymentSession.data,
        status: "authorized"
      }, 
      status: "authorized" 
    };
  }

  async updatePayment(context) {
    const { paymentSession } = context;
    return { session_data: paymentSession.data };
  }

  async capturePayment(paymentSession) {
    // Mark the payment as captured (would happen when delivery is complete)
    return { 
      data: {
        ...paymentSession.data,
        status: "captured"
      }, 
      status: "captured" 
    };
  }

  async cancelPayment(paymentSession) {
    // Cancel the COD payment
    return { 
      data: {
        ...paymentSession.data,
        status: "canceled"
      }, 
      status: "canceled" 
    };
  }

  async refundPayment(paymentSession, refundAmount) {
    // Process a refund for COD payment
    return { 
      data: {
        ...paymentSession.data,
        status: "refunded"
      }, 
      status: "refunded" 
    };
  }

  async retrievePayment(paymentSession) {
    // Simply return the payment session data
    return paymentSession.data;
  }
}

export default CodProviderService;