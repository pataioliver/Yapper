import { Builder, By, until } from 'selenium-webdriver';
import fetch from 'node-fetch';

const EXISTING_EMAIL = 'testuser@example.com'; // Use a seeded/test user
const NEW_PASSWORD = 'NewPassword123!';

(async function forgotPasswordTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 1. Start forgot password process via API to get the reset link (dev mode)
        const response = await fetch('http://localhost:5001/api/auth/request-password-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EXISTING_EMAIL })
        });
        const data = await response.json();
        const resetLink = data.resetLink; // The backend should return this in dev mode

        if (!resetLink) {
            throw new Error('No reset link received from backend!');
        }

        // 2. Open the reset link in the browser
        await driver.get(resetLink);

        // 3. Fill in the new password
        await driver.findElement(By.css('input[placeholder="New Password"]')).sendKeys(NEW_PASSWORD);
        await driver.findElement(By.css('input[placeholder="Confirm Password"]')).sendKeys(NEW_PASSWORD);

        // 4. Submit the new password
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 5. Wait for redirect to login page
        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return url.includes('/login');
        }, 5000);

        const url = await driver.getCurrentUrl();
        const success = url.includes('/login');
        console.log('Forgot password full flow test successful:', success);
    } catch (err) {
        console.error('Forgot password full flow test failed:', err);
    } finally {
        await driver.quit();
    }
})();