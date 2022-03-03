# Running In AWS EC2

This is a *very* rough guide to running this in the cloud on AWS.  To do this you'll need a
valid AWS account (and following this you will incur a small charge so need valid payment
info).

This is largely intended for those who have some familiarity with AWS & EC2, if you don't
know what either of those terms represent, then this isn't for you.

## Start An EC2 Instance

Start an ec2 instance, make sure you pick `t2-micro (free tier)` as the instance
type.  We do this so that it's totally free while setting everything up, once
we're good to go, we'll scale this instance up to handle more sessions.

I picked Amazon Linux 2 AMI Kernel 5.10 as my AMI.  Only port I opened was
22 to be able to ssh in.  Everything else was default.

If you don't already have a keypair set up, you'll be prompted to create
one.  Make sure you save the pem file as you'll need it after.

## SSH Into The Instance

ssh into the instance:

```shell
ssh -i /path/to/your/pem/file ec2-user@<your public ip>
```

where `/path/to/your/pem/file` is the path to the PEM file on your machine,
and `<your public ip>` is your instance's public IP (can find this in the
EC2 dashboard).

## Install Stuff

Install npm: <https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html>

Install dependencies:

```shell
npm i
```

Install dependencies for puppeteer (note: this may have been accomplished in the previous step):

```shell
sudo yum install alsa-lib.x86_64 atk.x86_64 cups-libs.x86_64 gtk3.x86_64 ipa-gothic-fonts libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXrandr.x86_64 libXScrnSaver.x86_64 libXtst.x86_64 pango.x86_64 xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-fonts-cyrillic xorg-x11-fonts-misc xorg-x11-fonts-Type1 xorg-x11-utils
```

Install git:

```shell
sudo yum install git
```

Clone the repo:

```shell
git clone https://github.com/bprussell/VstheWorld.git
```

## Test It Out

Try the script with 2 sessions. Start a game in streamer mode, and run:

```shell
node start ABCD -- --sessions 2
```

Verify that script executes and 2 audience are added.

## Spin Up Another Instance

Follow the same instructions and spin up a 2nd instance & set up
the same way.

Once both instances are able to get a couple audience members in, move to the
next step.

## Upgrade The Instances

Stop both instances in the EC2 dashboard.  Once stopped, upgrade them to a beefier machine.
Instructions: <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-resize.html>

I picked `t2.2xlarge` as the type to upgrade to. It has 8 VCPUS, 32 GiB Memory (at the time of writing)

**Important: this instance will cost money**.  Current pricing can be found
at: <https://aws.amazon.com/ec2/pricing/on-demand/>

EC2 instances are billed by the hour.

## Let Er Rip

Spin up both instances.  SSH into them again and run the script with the room code, 
this time using 250 sessions. Run this script:

```shell
node start ABCD -- --sessions 250
```

Since you're running two instances, you'll need to do this on both instances.
Verify you get up to 500 audience members (250 x 2).

Once that happens, background the `VstheWorld.js` script by hitting `ctrl+z`.
This leaves it running with the 250 audience members. Now start up the script
again to add another 250, and repeat on the other instance.

Should end up at 1000 audience members and bleep bloop, Achievement Unlocked.

Note that I found when I did 500 sessions and ran the script once it didn't work
as well as 250 run twice.  I also couldn't get all 1000 on one instance (it
topped out around 750 or so).

## But I Want To Do This For Free

I did experiment a little bit with t2.micro's (which are free tier).  I found
they topped out around 50-75 audience members (50 was no problem, 75 got there,
but was really slow).  So in theory, you could spin up 20 t2.micro's, install
all the things & whatnot, and ssh into 20 different instances, each with a
session count of 50, and hit 1000 that way.  As long as you're under the monthly
free hours (currently 750) you should remain free of charge.

You could also in theory set up one t2.micro exactly as you want, and then create
an AMI from that instance, and then spin up 19 more from that AMI thereby saving
you some setup time/hassle.

I didn't do that though, so I leave that as an exercise for the reader. :)
