const puppeteer = require('puppeteer');
const roomCode = process.argv[2];
const url = 'https://jackbox.tv';
if (!roomCode) {
    throw "Please provide room code as a first argument";
}
async function run () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const roomCodeElements = await page.$x("//input[@id='roomcode']")
    await roomCodeElements[0].type(roomCode);

    const usernameElements = await page.$x("//input[@id='username']")
    await usernameElements[0].type("foo");

    await page.waitForSelector(".audience");
    //const joinButtonElements = await page.$x("//input[@class='audience']")
    await page.click("#button-join");
    
    await page.waitForXPath('//*[contains(text(), "DISCONNECTED")]');

    browser.close();
}
run();