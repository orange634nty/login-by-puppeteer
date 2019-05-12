const puppeteer = require('puppeteer');
const fs = require('fs');

const KIBELA_EMAIL = process.env.KIBELA_EMAIL;
const KIBELA_PASS = process.env.KIBELA_PASS;
const KIBELA_LOGIN_URL = process.env.KIBELA_LOGIN_URL;

const requireEnvs = [
    KIBELA_EMAIL,
    KIBELA_PASS,
    KIBELA_LOGIN_URL
];

const COOKIES_PATH = 'token/cookies_kibela.json';

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
    await page.goto(KIBELA_LOGIN_URL, {waitUntil: 'domcontentloaded'});
    await page.type('input[name="user[email]"]', KIBELA_EMAIL);
    await page.type('input[name="user[password]"]', KIBELA_PASS);
    page.click('input[name="commit"]');
    await page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'});

    // Cookieをローカルに保存
    const afterCookies = await page.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(afterCookies));

    browser.close();
    console.log('success!');
})();
