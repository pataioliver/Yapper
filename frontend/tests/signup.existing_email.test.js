import { Builder, By, until } from 'selenium-webdriver';

const EXISTING_EMAIL = 'testuser2@example.com';
const TEST_NAME = 'Test User';
const TEST_PASSWORD = 'SomePassword123!';

(async function signupExistingEmailTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 1. Go to signup page
        await driver.get('http://localhost:5173/signup');

        // 2. Fill in the form with an existing email
        await driver.findElement(By.css('input[type="text"]')).sendKeys(TEST_NAME);
        await driver.findElement(By.css('input[type="email"]')).sendKeys(EXISTING_EMAIL);
        await driver.findElement(By.css('input[type="password"]')).sendKeys(TEST_PASSWORD);
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 3. Wait for error message 
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'already exists') or contains(text(),'already registered') or contains(text(),'Email already')]")), 5000);

        console.log('Signup with existing email test successful: true');
    } catch (err) {
        console.error('Signup with existing email test failed:', err);
    } finally {
        await driver.quit();
    }
})();