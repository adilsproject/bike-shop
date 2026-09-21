/*eslint-disable */

import { showAlert } from './alerts';

export const createReview = async (review, rating, bikeId) => {
  try {
    const res = await fetch(`/api/v1/bikes/${bikeId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review,
        rating,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    if (data.status === 'success') {
      showAlert('success', 'Review submitted successfully!');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('CATCH:', err.message);
    showAlert('error', err.message);
  }
};
