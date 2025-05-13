import { Builder, By, until } from 'selenium-webdriver';

const TEST_EMAIL = `testuser${Date.now()}@example.com`;
const TEST_NAME = 'Test User';
const TEST_PASSWORD = 'TestPassword123';

(async function signupRedirectTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5173/signup');

        await driver.findElement(By.css('input[type="text"]')).sendKeys(TEST_NAME);
        await driver.findElement(By.css('input[type="email"]')).sendKeys(TEST_EMAIL);
        await driver.findElement(By.css('input[type="password"]')).sendKeys(TEST_PASSWORD);
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for redirect to verify page
        await driver.wait(until.urlContains('/verify-email'), 5000);

        const url = await driver.getCurrentUrl();
        const success = url.includes('/verify-email');
        console.log('Signup redirect to verify page test successful:', success);
    } catch (err) {
        console.error('Signup redirect to verify page test failed:', err);
    } finally {
        await driver.quit();
    }
})();