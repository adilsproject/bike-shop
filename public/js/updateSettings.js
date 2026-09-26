/* eslint-disable */
// updateData
import { showAlert } from './alerts';

//type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await fetch(url, {
      method: 'PATCH',
      headers:
        type === 'password'
          ? {
              'Content-Type': 'application/json',
            }
          : {},
      body: type === 'password' ? JSON.stringify(data) : data,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message);
    }
    showAlert('success', `${type.toUpperCase()} updated successfully!`);
    setTimeout(() => {
      location.assign('/');
    }, 3000);
  } catch (err) {
    showAlert('error', err.message);
  }
};
