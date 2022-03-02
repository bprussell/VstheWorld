# VstheWorld
This is a solution to help with the "The Pole Mine: Vs the World" achievement in The Jackbox Party Pack 8.

This achievement requires the player to play a game of The Pole Mine in streamer mode with an audience of at least 1000. This application opens a large number of headless Chrome browser tabs and logs into the game corresponding to the room code provided when running the script.

The following instructions are for running on a Windows machine. If you have access to AWS and want to run this script in the cloud, refer to [these instructions](aws_ec2.md) by [@Pzelnip](https://github.com/pzelnip).

# Installation
Install the latest version of NodeJS at https://nodejs.org/

Open Powershell, navigate to the directory where the repo was cloned, and use Node Package Manager to install any dependencies (like Puppeteer).

```sh
npm i
```

# Usage

## Start the Game
Open a game in streamer mode, and join the lobby as a player. To conserve PC resources, I joined the game on my phone. Note the room code, because we need it for the script. Start the game, then pause it to give the script time to run.

## Running the Script
I recommend opening Task Manager to keep an eye on your PC's resources when running the script.

Open Powershell and navigate to the directory where the VstheWorld.js file is located. Execute the script using the following command, assuming the room code is ABCD:

```sh
npm start ABCD
```

This script uses a large amount of CPU and RAM. I was not able to run all 1000 browser sessions on one machine with 24GB of RAM. I recruited a friend to help, and he ran a couple instances of the script as well.

You can also specify how many sessions your machine can handle. This might take some trial and error. You can also increase the timeout value (in milliseconds) if the browsers time out before all 1000 sessions are reached.

```sh
npm start ABCD -- --sessions 500 --timeout 2000000
```

The script opens browser tabs in the background. Let it run for a bit, then unpause the game to see how many users are in the audience. If this number keeps going up, keep going. If your computer still has RAM available, open a new instance of Powershell and run the script again. I was not able to run one Powershell instance with 1000 sessions as it consumed too much CPU, but I was able to run 3 instances with it set to 334. My friend ran 2 instances of the script set to 500 sessions each.

If you manage to get 1000 sessions running, unpause the game and you should get the achievement. Congratulations!
