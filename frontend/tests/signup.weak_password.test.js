import { Builder, By, until } from 'selenium-webdriver';

const TEST_EMAIL = `weakpw${Date.now()}@example.com`;
const TEST_NAME = 'Weak Password User';
const WEAK_PASSWORD = '123'; // Too short

(async function signupWeakPasswordTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 1. Go to signup page
        await driver.get('http://localhost:5173/signup');

        // 2. Fill in the form with a weak password
        await driver.findElement(By.css('input[type="text"]')).sendKeys(TEST_NAME);
        await driver.findElement(By.css('input[type="email"]')).sendKeys(TEST_EMAIL);
        await driver.findElement(By.css('input[type="password"]')).sendKeys(WEAK_PASSWORD);
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 3. Wait for error message
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'at least 6') or contains(text(),'at least 8') or contains(text(),'Password too short')]")), 5000);

        console.log('Signup with weak password test successful: true');
    } catch (err) {
        console.error('Signup with weak password test failed:', err);
    } finally {
        await driver.quit();
    }
})();