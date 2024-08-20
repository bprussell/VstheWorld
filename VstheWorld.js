const puppeteer = require("puppeteer");
const { heads } = require("./headers");
const args = require("minimist")(process.argv.slice(2));

const roomCode = args["_"][0];
// These variables can be tweaked for performance reasons
const numberOfSessions = args["sessions"] || 334;
const sessionName = args["sessionname"] || '';
const timeoutMilliseconds = args["timeout"] || 1500000;

let counter = 0;

let hasBad = false;

if (args["help"]) {
  console.log(`
    Example usage:

      npm start ROOM_CODE -- [--sessions 334] [--timeout 1500000]

    Github: https://github.com/bprussell/VstheWorld
  `)
  return;
}

if (!roomCode) {
  throw "Please provide room code as a first argument";
}

const url = "https://jackbox.tv";
process.setMaxListeners(Infinity);

// Timeout function
function timeoutPromise(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));
}

async function runWithTimeout(browser, sessionId) {
  try {
    await Promise.race([
      run(browser, sessionId),
      timeoutPromise(5000) // 5 seconds timeout adjust as necessary
    ]);
  } catch (error) {
    if (error.message === 'Timeout') {
      hasBad = true;
      console.log(`Session ${sessionId} timed out.`);
    } else {
      throw error; // Re-throw other errors
    }
  }
}

async function run(browser, sessionId) {
  console.log('starting');
  const page = await browser.newPage();
  console.log('got page');
  // Configure the navigation timeout
  await page.setDefaultNavigationTimeout(0);

  //Pick a random UA and apply it
  const userAgent = heads[Math.floor(Math.random() * heads.length)];

  await page.setUserAgent(userAgent);

  //turns request interceptor on
  await page.setRequestInterception(true);

  //if the page makes a request to a resource type of image then abort that request
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
  await page.type("#username", "B" + sessionName + sessionId);
  console.log('entered username B' + sessionName + sessionId);

  // click "Join Audience" button once available
  await page.waitForSelector(".audience", { timeout: timeoutMilliseconds });
  await page.click("#button-join");
  counter++;
  console.log(`joined audience (${counter} total)`);

}


// Delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAll() {
  const browser = await puppeteer.launch();


  for (let i = 0; i < numberOfSessions; i++) {
    if (!hasBad) {
      await runWithTimeout(browser, i);
    } else {
      console.log("waiting a few minutes...");
      await delay(315000);
      console.log("waiting complete, trying again...");
      hasBad = false;
    }
  }

}


runAll();
