import { Builder, By, until } from 'selenium-webdriver';

const SENDER_EMAIL = 'testuser2@example.com';
const SENDER_PASSWORD = 'NewPassword123!';
const RECEIVER_NAME = 'Test User';
const MESSAGE_TEXT = 'Hello from Selenium test!';

(async function sendMessageTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // 1. Go to login page
        await driver.get('http://localhost:5173/login');

        // 2. Log in as testuser2@example.com
        await driver.findElement(By.css('input[type="email"]')).sendKeys(SENDER_EMAIL);
        await driver.findElement(By.css('input[type="password"]')).sendKeys(SENDER_PASSWORD);
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 3. Wait for redirect to main/chat page
        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return url === 'http://localhost:5173/' || url === 'http://localhost:5173';
        }, 5000);

        // 4. Find and click on the chat/user named "Test User"
        await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(),"${RECEIVER_NAME}")]`)), 5000);
        await driver.findElement(By.xpath(`//*[contains(text(),"${RECEIVER_NAME}")]`)).click();

        // 5. Wait for message input to appear, type and send message
        await driver.wait(until.elementLocated(By.css('input[placeholder="Type a message..."]')), 5000);
        await driver.findElement(By.css('input[placeholder="Type a message..."]')).sendKeys(MESSAGE_TEXT);
        await driver.findElement(By.xpath('//input[@placeholder="Type a message..."]/following-sibling::button')).click();

        // 6. Wait for the message to appear in the chat
        await driver.wait(until.elementLocated(By.xpath(`//*[contains(text(),"${MESSAGE_TEXT}")]`)), 5000);

        console.log('Send message test successful: true');
    } catch (err) {
        console.error('Send message test failed:', err);
    } finally {
        await driver.quit();
    }
})();