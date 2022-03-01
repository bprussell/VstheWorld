const puppeteer = require("puppeteer");
const args = require("minimist")(process.argv.slice(2));

const roomCode = args["_"][0];
// These variables can be tweaked for performance reasons
const numberOfSessions = args["sessions"] || 334;
const timeoutMilliseconds = args["timeout"] || 1500000;

if (!roomCode) {
    throw "Please provide room code as a first argument";
}

const url = "https://jackbox.tv";
process.setMaxListeners(Infinity);

async function run(browser, sessionId) {
    console.log('starting');
    const page = await browser.newPage();
    console.log('got page');
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

    console.log('about to go to jackbox');
    // go to jackbox.tv
    await page.goto(url);
    console.log('got jackbox page');

    // enter room code
    await page.waitForSelector("#roomcode", { timeout: timeoutMilliseconds });
    await page.type("#roomcode", roomCode);
    console.log('entered room code');

    // enter user name
    await page.waitForSelector("#username", { timeout: timeoutMilliseconds });
    await page.type("#username", "User" + sessionId);
    console.log('entered username ' + sessionId);

    // click "Join Audience" button once available
    await page.waitForSelector(".audience", { timeout: timeoutMilliseconds });
    await page.click("#button-join");
    console.log('joined audience');

    // When game ends, browser displays "DISCONNECTED", so we are done
    await page.waitForXPath('//*[contains(text(), "DISCONNECTED")]', { timeout: timeoutMilliseconds });
    console.log('discoed');

    browser.close();
}
async function runAll() {
    const browser = await puppeteer.launch();
    // set up the sessions
    const sessions = [...Array(numberOfSessions).keys()].map(x => run(browser, x));
    // run all the sessions in parallel
    await Promise.all(sessions);
}
runAll();
