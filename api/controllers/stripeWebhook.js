import Stripe from "stripe";
import { fulfillOrder } from "../utils/bookingHelper.js";

export const stripeWebhook = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.bookingId;

    try {
      console.log(`>>> [Webhook] Confirming: ${bookingId}`);
      await fulfillOrder(bookingId, paymentIntent.id);
    } catch (error) {
      console.error("Fulfillment Error:", error);
      return res.status(500).send("Fulfillment Error");
    }
  }

  res.status(200).send({ received: true });
};
