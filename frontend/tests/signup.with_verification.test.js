import fetch from 'node-fetch';

const TEST_EMAIL = `testuser${Date.now()}@example.com`;
const TEST_NAME = 'Test User';
const TEST_PASSWORD = 'TestPassword123';

(async function registerAndVerifyTest() {
    try {
        // 1. Regisztráció
        const signupResponse = await fetch('http://localhost:5001/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: TEST_NAME,
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            })
        });
        const signupData = await signupResponse.json();
        const { token, verificationCode } = signupData;
        if (!token || !verificationCode) {
            throw new Error('No verification code or token received from backend!');
        }

        // 2. Verifikáció
        const verifyResponse = await fetch('http://localhost:5001/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token,
                verificationCode,
                fullName: TEST_NAME,
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            })
        });
        const verifyData = await verifyResponse.json();
        const success = verifyResponse.status === 201;
        console.log('Registration and verification test successful:', success, verifyData);

    } catch (err) {
        console.error('Registration and verification test failed:', err);
    }
})();