# VstheWorld
This is a solution to help with the "The Pole Mine: Vs the World" achievement in The Jackbox Party Pack 8.

This achievement requires the player to play a game of The Pole Mine in streamer mode with an audience of at least 1000. This application opens a large number of headless Chrome browser tabs and logs into the game corresponding to the room code provided when running the script.

# Installation
Install the latest version of NodeJS at https://nodejs.org/

Open Powershell, navigate to the directory where the repo was cloned, and use Node Package Manager to install Puppeteer.
    
    npm i puppeteer --save

# Running the Script

This script uses a large amount of CPU and RAM. I was not able to run all 1000 browser sessions on one machine. I was able to get up to 768 sessions, and at that point, it was not adding any more members to the audience. You will likely need to run this script on multiple machines to get the achievement.

Open the VstheWorld.js file in a text editor, and update the `numberOfSessions` value at the top of the file to the number of browser sessions your machine can handle. This might take some trial and error. You can also increase the `timeoutMilliseconds` value if the browsers time out before all 1000 sessions are reached.

Open a game in streamer mode, and join the lobby as a player. To conserve PC resources, I joined the game on my phone. Note the room code, because we need it for the script. Start the game, then pause it to give the script time to run.

I recommend opening Task Manager to keep an eye on your PC's resources when running the script.

Open Powershell and navigate to the directory where the VstheWorld.js file is located. Execute the script using the following command, assuming the room code is ABCD:

    node VstheWorld.js ABCD

This will start opening browser tabs in the background. Let it run for a bit, then unpause the game to see how many users are in the audience. If this number keeps going up, keep going. If your computer still has RAM available, open a new instance of Powershell and run the script again. I was not able to run one Powershell instance with the `numberOfSessions` set to 1000 as it consumed too much CPU, but I was able to run 3 instances with it set to 334. However, I was running out of RAM and it stopped making new connections when the audience size was 768. Doing this same process on another machine should get me over the hump, but I have not had the opportunity to try that yet.

If you manage to get 1000 sessions running, unpause the game and you should get the achievement. Congratulations!