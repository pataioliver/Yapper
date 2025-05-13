import { Builder, By, until } from 'selenium-webdriver';

const USER_EMAIL = 'testuser2@example.com';
const USER_PASSWORD = 'NewPassword123!';

(async function logoutFlowTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 1. Go to login page
        await driver.get('http://localhost:5173/login');

        // 2. Log in
        await driver.findElement(By.css('input[type="email"]')).sendKeys(USER_EMAIL);
        await driver.findElement(By.css('input[type="password"]')).sendKeys(USER_PASSWORD);
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 3. Wait for redirect to main page
        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return url === 'http://localhost:5173/' || url === 'http://localhost:5173';
        }, 5000);

        // 4. Click the logout button (adjust selector as needed)
        await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Logout')]")), 5000);
        await driver.findElement(By.xpath("//button[contains(.,'Logout')]")).click();

        // 5. Wait for redirect to login page
        await driver.wait(until.urlContains('/login'), 5000);

        const url = await driver.getCurrentUrl();
        const success = url.includes('/login');
        console.log('Logout flow test successful:', success);

        
        await driver.get('http://localhost:5173/');
        await driver.wait(until.urlContains('/login'), 5000);
        const urlAfter = await driver.getCurrentUrl();
        const protectedRedirect = urlAfter.includes('/login');
        console.log('Protected route redirect after logout:', protectedRedirect);

    } catch (err) {
        console.error('Logout flow test failed:', err);
    } finally {
        await driver.quit();
    }
})();