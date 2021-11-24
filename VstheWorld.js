const puppeteer = require('puppeteer');
const roomCode = process.argv[2];
const url = 'https://jackbox.tv';
process.setMaxListeners(Infinity);
if (!roomCode) {
    throw "Please provide room code as a first argument";
}
async function run (sessionId) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //turns request interceptor on
    await page.setRequestInterception(true);

    //if the page makes a  request to a resource type of image or stylesheet then abort that request
    page.on('request', request => {
    if (request.resourceType() === 'image')
        request.abort();
    else
        request.continue();
    });

    // go to jackbox.tv
    await page.goto(url);

    // enter room code
    await page.waitForSelector("#roomcode",{timeout:500000});
    await page.type("#roomcode", roomCode);

    // enter user name
    await page.waitForSelector("#username",{timeout:500000});
    await page.type("#username", "User" + sessionId);

    // click "Join Audience" button once available
    await page.waitForSelector(".audience",{timeout:500000});
    await page.click("#button-join");
    
    // When game ends, browser displays "DISCONNECTED", so we are done
    await page.waitForXPath('//*[contains(text(), "DISCONNECTED")]',{timeout:500000});

    browser.close();
}
async function runAll(){
    const sessions = [...Array(100).keys()].map(x => run(x)); // set up 1000 sessions
    await Promise.all(sessions);
}
runAll();