/*eslint-disable */

import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await fetch('/api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        passwordConfirm,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    if (data.status === 'success') {
      showAlert('success', 'Signed up successfully!');

      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('CATCH:', err.message);
    showAlert('error', err.message);
  }
};
