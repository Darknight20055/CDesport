export const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL || 'https://www.cdesport.com'; // 👈 fallback explicite

  if (!token) throw new Error('Missing token');
  if (!API_URL) throw new Error('API URL is not configured.');

  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user profile');
    }

    return data;
  } catch (err) {
    console.error('❌ Error in fetchUserProfile:', err);
    throw new Error('Failed to load user profile');
  }
};
