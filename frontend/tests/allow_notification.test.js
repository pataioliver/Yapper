import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const options = new chrome.Options();
options.setUserPreferences({
  'profile.default_content_setting_values.notifications': 1 // 1 = allow, 2 = block
});

const USER_EMAIL = 'testuser2@example.com';
const USER_PASSWORD = 'NewPassword123!';

(async function allowNotificationTest() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // 1. Log in
        await driver.get('http://localhost:5173/login');
        await driver.findElement(By.css('input[type="email"]')).sendKeys(USER_EMAIL);
        await driver.findElement(By.css('input[type="password"]')).sendKeys(USER_PASSWORD);
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 2. Wait for redirect to main page
        await driver.wait(until.urlIs('http://localhost:5173/'), 5000);

        // 3. Go to settings page 
        await driver.get('http://localhost:5173/settings');

        // 4. Wait for the allow notification button to appear 
        await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Enable Notification')]")), 5000);

        // 5. Click the allow notification button
        await driver.findElement(By.xpath("//button[contains(.,'Enable Notification')]")).click();

        // 6. Wait for a success message or state change
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Notifications enabled') or contains(text(),'Notifications Allowed') or contains(text(),'Successfully Enabled')]")), 5000);

        console.log('Allow notification button test successful: true');
    } catch (err) {
        console.error('Allow notification button test failed:', err);
    } finally {
        await driver.quit();
    }
})();