import { showAlert } from './alerts';

export const buyBike = async (bikeId) => {
  const stripe = Stripe(
    'pk_test_51UBAIDHIyYdKchNrniwdImDS7yBka22aPwrKcIywQE5DirVNLvh5Qc3TcMU9Z3vY2SGoOWF9valgTHmBok5GXT2I002QuiJxKe',
  );

  try {
    // 1) Get checkout session from API
    const res = await fetch(`/api/v1/buying/checkout-session/${bikeId}`);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const session = await res.json();

    console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
