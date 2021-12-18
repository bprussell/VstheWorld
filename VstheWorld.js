const timeoutMilliseconds = 1500000; // This variable can be tweaked for performance reasons

const puppeteer = require('puppeteer');
const roomCode = process.argv[2];
const numberOfSessions = process.argv[3];
const url = 'https://jackbox.tv';
process.setMaxListeners(Infinity);
if (!roomCode) {
    throw "Please provide room code as a first argument";
}
if(!numberOfSessions){
    numberOfSessions = 334; // a default number that works for me
}
async function run (browser, sessionId) {
    const page = await browser.newPage();
    // Configure the navigation timeout
    await page.setDefaultNavigationTimeout(0);
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
    await page.waitForSelector("#roomcode",{timeout:timeoutMilliseconds});
    await page.type("#roomcode", roomCode);

    // enter user name
    await page.waitForSelector("#username",{timeout:timeoutMilliseconds});
    await page.type("#username", "User" + sessionId);

    // click "Join Audience" button once available
    await page.waitForSelector(".audience",{timeout:timeoutMilliseconds});
    await page.click("#button-join");
    
    // When game ends, browser displays "DISCONNECTED", so we are done
    await page.waitForXPath('//*[contains(text(), "DISCONNECTED")]',{timeout:timeoutMilliseconds});

    browser.close();
}
async function runAll(){
    const browser = await puppeteer.launch();
     // set up the sessions
    const sessions = [...Array(numberOfSessions).keys()].map(x => run(browser, x));
    // run all the sessions in parallel
    await Promise.all(sessions);
}
runAll();