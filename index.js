const puppeteer = require('puppeteer');
const fs = require('fs');

const KIBELA_EMAIL = process.env.KIBELA_EMAIL;
const KIBELA_PASS = process.env.KIBELA_PASS;

const COOKIES_PATH = 'token/cookies_kibela.json';
const KIBELA_LOGIN_URL = 'https://xxx.kibe.la/signin'; // <- 適切に変更してください

// ログインしてcookieを取得
const getCookie = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await login(page);
  browser.close();
};

// cookieを使ってログイン
// タイトルを取得
const getInfomation = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await loginWithCookie(page);
  await page.goto(url, {waitUntil: 'domcontentloaded'});
  let title = await page.$eval('#title', item => {
      return item.textContent;
  });
  browser.close();
}

// パスワードを使ってログインする
const login = async page => {
    await page.goto(KIBELA_LOGIN_URL, {waitUntil: 'domcontentloaded'});
    await page.type('input[name="user[email]"]', KIBELA_EMAIL);
    await page.type('input[name="user[password]"]', KIBELA_PASS);
    page.click('input[name="commit"]');
    await page.waitForNavigation({timeout: 60000, waitUntil: 'domcontentloaded'});
    // クッキー保存
    const afterCookies = await page.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(afterCookies));
}

// ローカルに保存したcookieをセットする
const loginWithCookie = async page =>  {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
    for (let cookie of cookies) {
      await page.setCookie(cookie);
    }
};
