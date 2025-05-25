const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) throw new Error('❌ REACT_APP_API_URL is not defined');

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (pseudo, email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/resend-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Resend email failed');
    }

    return data;
  } catch (error) {
    console.error('Resend verification email error:', error);
    throw error;
  }
};

// ✅ Nouvelle fonction pour vérifier le code reçu par email
export const verifyEmailCode = async (email, code) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Verification failed');
    }

    return data;
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};
