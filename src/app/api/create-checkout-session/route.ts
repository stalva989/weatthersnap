import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: "WeatherSnap Report",
              description:
                "Professional Weather Snapshot PDF",
            },

            unit_amount: 599,
          },

          quantity: 1,
        },
      ],

      success_url:
        `${process.env.NEXT_PUBLIC_APP_URL}/success`,

      cancel_url:
        `${process.env.NEXT_PUBLIC_APP_URL}/`,

    });

    return Response.json({
      url: session.url,
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        error:
          "Unable to create checkout session.",
      },
      {
        status: 500,
      }
    );

  }
}