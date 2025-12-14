const bcrypt = require('bcryptjs');
const fetch = require('node-fetch').default;

async function testAuth() {
  const email = 'test@example.com';
  const password = 'testpassword';

  try {
    // First, get the CSRF token
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;

    console.log('CSRF Token:', csrfToken);

    const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: email,
        password: password,
        csrfToken: csrfToken,
        callbackUrl: '/',
      }),
    });

    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response text:', text);

    // Check if it's a redirect
    if (response.status === 302) {
      console.log('Redirect location:', response.headers.get('location'));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();
