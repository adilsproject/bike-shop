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

// export const buyBike = async (bikeId) => {
//   console.log('1. buyBike started', bikeId);

//   const stripe = Stripe(
//     'pk_test_51UBAIDHIyYdKchNrniwdImDS7yBka22aPwrKcIywQE5DirVNLvh5Qc3TcMU9Z3vY2SGoOWF9valgTHmBok5GXT2I002QuiJxKe',
//   );

//   try {
//     console.log('2. Stripe initialized');

//     const res = await fetch(`/api/v1/buying/checkout-session/${bikeId}`);

//     console.log('3. Fetch completed', res.status);

//     if (!res.ok) {
//       throw new Error(`HTTP error: ${res.status}`);
//     }

//     const session = await res.json();

//     console.log('4. Session:', session);
//     console.log('5. Session ID:', session.session.id);

//     await stripe.redirectToCheckout({
//       sessionId: session.session.id,
//     });

//     console.log('6. Redirect called');
//   } catch (err) {
//     console.log('ERROR:', err);
//     showAlert('error', err);
//   }
// };
