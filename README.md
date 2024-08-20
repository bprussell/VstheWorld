# VstheWorld

This is a solution to help with the "The Poll Mine: Vs the World" achievement in The Jackbox Party Pack 8.

This achievement requires the player to play a game of The Poll Mine in streamer mode with an audience of at least 1000. This application opens a large number of headless Chrome browser tabs and logs into the game corresponding to the room code provided when running the script.

The following instructions are for running on a Windows machine. If you have access to AWS and want to run this script in the cloud, refer to [these instructions](aws_ec2.md) by [@Pzelnip](https://github.com/pzelnip).

# Installation

Install the latest version of NodeJS at https://nodejs.org/

Clone this repository to your machine.

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

There are various parameters that you can specify when running the script:

### Arguments

#### Sessions

```
--sessions [number]
```

- Default: 334
- Description: specify how many sessions your machine can handle. This might take some trial and error.

#### Checktime

```
--checktime [number]
```

- Default: 5000 (5 seconds)
- Description: The timeout value (in milliseconds) that is used to trigger a cooldown. If a browser is unable to join the audience within the specified time, a cooldown of 5 minutes and 15 seconds will be triggered. (Jackbox servers limit your requests and will temporarily disable all calls from your IP for 5 minutes if you make too many calls). If you notice the cooldown being triggered too often, try increasing this to a higher value. Slower machines/internet may require 8000 or 10000+.

#### Session name

```
--sessionname [text]
```

- Default: [none]
- Description: Allows you to specify a unique identifier for the script. If you are running multiple instances of this script, this will prevent audience member from having duplicate names when joining. Works best if only provided 1 or 2 letters like a, b, c, etc.
  checktime (default: 5000 (5 seconds))

#### Timeout

```
--timeout [number]
```

- Default: 1500000 (25 minutes)
- Description: The timeout value (in milliseconds) for each browser if it is unable to complete every action. Once this time is reached the browser will close if it was unable to connect to the audience.

```sh
npm start ABCD -- --sessions 500 --checktime 5000 --sessionname a --timeout 2000000
```

You don't need to put all the args, only the ones you want to change from their default value.

The script opens browser tabs in the background. Let it run for a bit, then unpause the game to see how many users are in the audience. If this number keeps going up, keep going. If your computer still has RAM available, open a new instance of Powershell and run the script again. I was not able to run one Powershell instance with 1000 sessions as it consumed too much CPU, but I was able to run 3 instances with it set to 334. My friend ran 2 instances of the script set to 500 sessions each.

If you manage to get 1000 sessions running, unpause the game and you should get the achievement. Congratulations!
