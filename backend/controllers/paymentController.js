const { Cashfree, CFEnvironment } = require("cashfree-pg");

// Initialize Cashfree
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

const createPayment = async (req, res) => {
  try {
    const {
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
    } = req.body;

    // Sanitize phone number (remove spaces, brackets, hyphens; keep only digits and leading +)
    const sanitizedPhone = customerPhone ? customerPhone.replace(/[^\d+]/g, "") : "9999999999";

    const request = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",

      customer_details: {
        customer_id: orderId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: sanitizedPhone,
      },

      order_meta: {
        return_url:
          "http://localhost:3000/order-success?order_id={order_id}",
      },
    };

    console.log("Creating Cashfree Order with request:", request);

    const response = await cashfree.PGCreateOrder(request);

    res.status(200).json({
      success: true,
      paymentSessionId:
        response.data.payment_session_id,
      cashfreeOrderId:
        response.data.order_id,
    });

  } catch (error) {

    console.error("Cashfree Error:", error.response ? error.response.data : error);

    res.status(500).json({
      success: false,
      message: error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message,
    });

  }
};


module.exports = {
  createPayment,
};