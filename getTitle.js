const puppeteer = require('puppeteer');
const fs = require('fs');

const COOKIES_PATH = 'token/cookies.json';

// entry point
(async () => {
  const url = process.argv[2];
  if (url == undefined)  {
    console.log('require args url like "yarn run getTitle <url>"');
    return;
  }
  console.log(`try to get title of : ${url} ...`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // ローカルのCookieを使ってログイン
  const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
  for (let cookie of cookies) {
    await page.setCookie(cookie);
  }

  // タイトルを取得
  await page.goto(url, {waitUntil: 'domcontentloaded'});
  let title = await page.$eval('#title', item => {
      return item.textContent;
  });
  browser.close();

  console.log(`title: ${title}`)
})();
