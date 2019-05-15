const puppeteer = require('puppeteer');
const fs = require('fs');

const ACCOUNT_EMAIL = process.env.ACCOUNT_EMAIL;
const ACCOUNT_PASS = process.env.ACCOUNT_PASS;
const LOGIN_URL = process.env.LOGIN_URL;

const requireEnvs = [
    ACCOUNT_EMAIL,
    ACCOUNT_PASS,
    LOGIN_URL
];

const COOKIES_PATH = 'token/cookies.json';

// entry point
(async () => {
    for (let requireEnv of requireEnvs) {
        if (requireEnv == undefined) {
            console.log('local env is not set.');
            return;
        }
    }
    console.log('try to get cookie...');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // パスワードを使ってログイン
    await page.goto(LOGIN_URL, {waitUntil: 'domcontentloaded'});
    await page.type('input[name="user[email]"]', ACCOUNT_EMAIL);
    await page.type('input[name="user[password]"]', ACCOUNT_PASS);
    page.click('input[name="commit"]');
    await page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'});

    // Cookieをローカルに保存
    const afterCookies = await page.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(afterCookies));

    browser.close();
    console.log('success!');
})();
