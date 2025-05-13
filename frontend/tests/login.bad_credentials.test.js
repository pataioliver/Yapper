import { Builder, By, until } from 'selenium-webdriver';

(async function loginInvalidTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5173/login');

        await driver.findElement(By.css('input[type="email"]')).sendKeys('wronguser@example.com');
        await driver.findElement(By.css('input[type="password"]')).sendKeys('wrongpassword');
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for possible error message or that URL does NOT change to root
        await driver.sleep(1000); // Wait for error toast or UI update

        const url = await driver.getCurrentUrl();
        const success = url.includes('/login'); // Still on login page means login failed

        console.log('Login with wrong credentials test successful:', success);
    } catch (err) {
        console.error('Login with wrong credentials test failed:', err);
    } finally {
        await driver.quit();
    }
})();