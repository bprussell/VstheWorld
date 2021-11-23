const puppeteer = require('puppeteer');
const roomCode = process.argv[2];
const url = 'https://jackbox.tv';
if (!roomCode) {
    throw "Please provide room code as a first argument";
}
async function run (sessionId) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // enter room code
    const roomCodeElements = await page.$x("//input[@id='roomcode']")
    await roomCodeElements[0].type(roomCode);

    // enter user name
    const usernameElements = await page.$x("//input[@id='username']")
    await usernameElements[0].type("User" + sessionId);

    // click "Join Audience" button once available
    await page.waitForSelector(".audience");
    await page.click("#button-join");
    
    // When game ends, browser displays "DISCONNECTED", so we are done
    await page.waitForXPath('//*[contains(text(), "DISCONNECTED")]');

    browser.close();
}
async function runAll(){
    const sessions = [...Array(10).keys()].map(x => run(x)); // set up 1000 sessions
    await Promise.all(sessions);
}
runAll();