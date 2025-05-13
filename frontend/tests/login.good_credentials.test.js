import { Builder, By, until } from 'selenium-webdriver';

(async function loginTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5173/login');

        await driver.findElement(By.css('input[type="email"]')).sendKeys('digivagyok@gmail.com');
        await driver.findElement(By.css('input[type="password"]')).sendKeys('Jelszo1234');
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait until redirected to the root page
        await driver.wait(async () => {
            const url = await driver.getCurrentUrl();
            return url === 'http://localhost:5173/';
        }, 5000);

        const url = await driver.getCurrentUrl();
        const success = url === 'http://localhost:5173/';
        console.log('Login test successful:', success);
    } catch (err) {
        console.error('Login test failed:', err);
    } finally {
        await driver.quit();
    }
})();