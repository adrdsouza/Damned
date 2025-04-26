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
      ? "https://sandbox.gateway.sezzle.com" 
      : "https://gateway.sezzle.com";
      
    // Authentication token cache with expiration time
    this.authToken = null;
    this.tokenExpiration = null;
      
    // Configuration for capture mode
    this.captureMode = options.capture_mode || "manual"; // Can be "automatic" or "manual"
  }
  
  /**
   * Get authentication token for Sezzle API
   * Tokens are valid for 120 minutes, but we'll refresh after 110 minutes
   */
  async getAuthToken() {
    const now = new Date();
    
    // If token exists and is not expired, return it
    if (this.authToken && this.tokenExpiration && now < this.tokenExpiration) {
      return this.authToken;
    }
    
    // Otherwise, get a new token
    try {
      const authResponse = await axios.post(
        `${this.apiUrl}/v2/authentication`,
        {
          public_key: this.options_.public_key,
          private_key: this.options_.private_key
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );
      
      // Store token and expiration time (subtract 10 minutes to be safe)
      this.authToken = authResponse.data.token;
      
      // Parse expiration date from response and subtract 10 minutes
      const expirationDate = new Date(authResponse.data.expiration_date);
      this.tokenExpiration = new Date(expirationDate.getTime() - 10 * 60 * 1000);
      
      return this.authToken;
    } catch (error) {
      console.error("Error obtaining Sezzle authentication token:", error);
      throw error;
    }
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

    // Create a Sezzle card session
    try {
      // Get authentication token first
      const authToken = await this.getAuthToken();
      
      // Get customer billing address from context if available
      const billingAddress = customer?.billing_address || {};
      
      // Format the order details for Sezzle card session
      const sessionPayload = {
        origin: process.env.FRONTEND_URL || "https://damneddesigns.com",
        mode: "iframe",
        merchant_reference_id: resource_id, // Use the cart/order ID as reference
        amount_in_cents: amount, // Medusa stores amount in cents already
        currency: currency_code.toUpperCase(),
        customer: {
          email: customer?.email || "",
          first_name: customer?.first_name || "",
          last_name: customer?.last_name || "",
          phone: customer?.phone || "",
          billing_address: {
            street: billingAddress.address_1 || "",
            street2: billingAddress.address_2 || "",
            city: billingAddress.city || "",
            state: billingAddress.province || "",
            postal_code: billingAddress.postal_code || "",
            country_code: billingAddress.country_code || "US"
          }
        }
      };

      // Add cart items if available in context
      if (medusaContext?.cart?.items?.length > 0) {
        sessionPayload.items = medusaContext.cart.items.map(item => ({
          name: item.title,
          sku: item.variant?.sku || item.id,
          quantity: item.quantity,
          price: {
            amount_in_cents: item.unit_price * item.quantity,
            currency: currency_code.toUpperCase()
          }
        }));
      }

      // Make API call to Sezzle to create a card session
      const response = await axios.post(
        `${this.apiUrl}/v2/session/card`, 
        sessionPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${authToken}`
          }
        }
      );

      // Process Sezzle response and return payment session data
      const paymentData = {
        session_id: response.data.uuid,
        dashboard_url: response.data.dashboard_url,
        status: "pending",
        data: response.data,
      };

      return {
        session_data: paymentData,
        update_requests: {
          customer_metadata: {
            sezzle_dashboard_url: response.data.dashboard_url,
          }
        }
      };
    } catch (error) {
      console.error("Error initiating Sezzle payment:", error);
      throw error;
    }
  }

  async authorizePayment(paymentSession, context) {
    // For card sessions, we can check if the session is complete by checking the status
    // The virtual card will have been authorized already if the dashboard flow is complete
    
    try {
      // For Sezzle Card payments, we assume authorized once the card data has been created
      // and the payment is processed by the merchant's regular payment processor
      
      // Get session details from paymentSession
      const { session_id } = paymentSession.data;
      
      // Get authentication token first
      const authToken = await this.getAuthToken();
      
      // We need to attempt to update the session with order information
      // This informs Sezzle that the order has been completed
      const orderId = context?.order?.id || context?.resource_id;
      
      if (orderId) {
        try {
          // Update the card session with the order ID
          await axios.patch(
            `${this.apiUrl}/v2/session/${session_id}/card`,
            {
              order_id: orderId
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${authToken}`
              }
            }
          );
          
          // Update the payment session status to authorized
          const updatedData = {
            ...paymentSession.data,
            status: "authorized",
            order_id: orderId
          };
          
          return { data: updatedData, status: "authorized" };
        } catch (updateError) {
          console.error("Error updating Sezzle session with order ID:", updateError);
          // Continue with authorization process even if update fails
        }
      }
      
      // For now, we'll return the payment as pending if we couldn't update with order ID
      return { data: paymentSession.data, status: "pending" };
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
    // For Sezzle Card sessions, capture is not needed as the virtual card
    // is already charged via the regular payment processor
    
    // We simply update the status to captured
    const updatedData = {
      ...paymentSession.data,
      status: "captured"
    };
    
    return { data: updatedData, status: "captured" };
  }

  async cancelPayment(paymentSession) {
    // For Sezzle Card sessions, cancellation should be handled by the merchant
    // through their regular payment processor
    
    // We simply update the status to canceled
    const updatedData = {
      ...paymentSession.data,
      status: "canceled"
    };
    
    return { data: updatedData, status: "canceled" };
  }

  async refundPayment(paymentSession, refundAmount) {
    // For Sezzle Card sessions, refunds should be handled by the merchant
    // through their regular payment processor
    
    // We simply update the status to refunded
    const updatedData = {
      ...paymentSession.data,
      status: "refunded",
      refund_amount: refundAmount
    };
    
    return { data: updatedData, status: "refunded" };
  }

  async retrievePayment(paymentSession) {
    // For Sezzle Card sessions, we don't need to check with Sezzle
    // since payment is processed through the regular payment processor
    
    // Just return the current payment data
    return paymentSession.data;
  }
}

export default SezzleProviderService;